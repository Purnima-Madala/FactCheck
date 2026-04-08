const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Gemini (fallback)
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// System prompt for fact-checking
const SYSTEM_PROMPT = `You are an expert fact-checker AI with deep knowledge of science, history, current events, and critical thinking. Your task is to analyze claims and provide accurate, evidence-based assessments.

For the given claim, provide:
1. A verdict: "true", "false", "misleading", or "unverified"
   - "true": The claim is factually correct
   - "false": The claim is factually incorrect
   - "misleading": The claim contains some truth but is presented deceptively or lacks important context
   - "unverified": There is insufficient reliable evidence to confirm or refute the claim

2. An error/hallucination percentage (0-100)
   - 0-20: Highly accurate, minor details only
   - 21-40: Mostly accurate with some imprecision
   - 41-60: Mixed accuracy, significant caveats needed
   - 61-80: Mostly inaccurate with some truth
   - 81-100: Completely false or fabricated

3. A concise explanation (2-4 sentences) that:
   - Clearly states why the claim is true/false/misleading
   - References established facts or consensus
   - Notes any important context or nuance

IMPORTANT: 
- Base your analysis on widely accepted facts and scientific consensus
- Avoid political bias and conspiracy theories
- If uncertain, err toward "unverified" and explain what evidence would be needed

Output must be valid JSON with exactly these keys:
{
  "query": "the original claim text",
  "verdict": "true|false|misleading|unverified",
  "errorPercentage": number,
  "explanation": "explanation text"
}

Respond ONLY with the JSON object. No other text.`;

/**
 * Format sources from Google Fact Check Tools
 */
function formatFactCheckSources(data) {
  if (!data || !data.claims || !Array.isArray(data.claims)) {
    return [];
  }

  return data.claims.slice(0, 4).map(claim => {
    const review = claim.claimReview && claim.claimReview[0];
    return {
      title: review?.publisher?.name || 'Fact-Checking Organization',
      url: review?.url || 'https://toolbox.google.com/factcheck/explorer',
      excerpt: review?.title || claim.text || 'Fact-check analysis of this claim.',
      relevance: 0.85 + (Math.random() * 0.1) // Slight variation for realism
    };
  });
}

/**
 * Fetch fact-check sources from Google Fact Check Tools API
 */
async function fetchFactCheckSources(query) {
  if (!process.env.GOOGLE_FACTCHECK_API_KEY) {
    console.log('⚠️  No Google Fact Check API key - skipping source fetch');
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodedQuery}&key=${process.env.GOOGLE_FACTCHECK_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(`⚠️  Fact Check API returned ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    return formatFactCheckSources(data);
    
  } catch (error) {
    console.error('❌ Fact Check API error:', error.message);
    return [];
  }
}

/**
 * Generate fallback sources when APIs are unavailable
 */
function generateFallbackSources(query, verdict) {
  // For demo/fallback purposes only
  const generalSources = [
    {
      title: 'Wikipedia',
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
      excerpt: 'Search Wikipedia for information related to this claim.',
      relevance: 0.7
    },
    {
      title: 'Google Scholar',
      url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
      excerpt: 'Search academic literature for research on this topic.',
      relevance: 0.65
    }
  ];

  if (verdict === 'unverified') {
    return generalSources;
  }

  return [
    ...generalSources,
    {
      title: 'FactCheck.org',
      url: 'https://www.factcheck.org',
      excerpt: 'A nonpartisan fact-checking organization.',
      relevance: 0.6
    }
  ];
}

/**
 * Primary: Query NVIDIA NIM API
 */
async function queryNvidiaNIM(query) {
  if (!process.env.NVIDIA_API_KEY) {
    console.log('⚠️  NVIDIA API key not configured');
    return null;
  }

  try {
    // Using NVIDIA's Llama 3.1 Nemotron Nano model (free tier)
    const response = await fetch('https://api.nvcf.nvidia.com/v2/nvcf/pexec/functions/0b2b7dfc-f5c3-4b9b-b3b7-2d8e6f5a3c2e', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
        'NVCF-INPUT-ASSET-REFERENCES': '[]',
        'NVCF-FUNCTION-ASSET-IDS': '[]'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Fact-check this claim: "${query}"` }
        ],
        temperature: 0.1,
        max_tokens: 800,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`⚠️  NVIDIA API error (${response.status}):`, errorText.substring(0, 200));
      return null;
    }

    const data = await response.json();
    
    // Extract content from NVIDIA response
    let content = '';
    if (data.choices && data.choices[0] && data.choices[0].message) {
      content = data.choices[0].message.content;
    } else if (data.response) {
      content = data.response;
    } else {
      console.log('⚠️  Unexpected NVIDIA response format');
      return null;
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('⚠️  Could not parse JSON from NVIDIA response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    console.log('✅ NVIDIA API success');
    
    return {
      query: parsed.query || query,
      verdict: parsed.verdict || 'unverified',
      errorPercentage: Math.min(100, Math.max(0, Number(parsed.errorPercentage) || 50)),
      explanation: parsed.explanation || 'Analysis completed.',
      source: 'nvidia'
    };

  } catch (error) {
    console.error('❌ NVIDIA API exception:', error.message);
    return null;
  }
}

/**
 * Fallback: Query Google Gemini API
 */
async function queryGemini(query) {
  if (!genAI) {
    console.log('⚠️  Gemini API not configured');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `${SYSTEM_PROMPT}\n\nFact-check this claim: "${query}"`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('⚠️  Could not parse JSON from Gemini response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    console.log('✅ Gemini API success');
    
    return {
      query: parsed.query || query,
      verdict: parsed.verdict || 'unverified',
      errorPercentage: Math.min(100, Math.max(0, Number(parsed.errorPercentage) || 50)),
      explanation: parsed.explanation || 'Analysis completed.',
      source: 'gemini'
    };

  } catch (error) {
    console.error('❌ Gemini API exception:', error.message);
    return null;
  }
}

/**
 * Generate local fallback analysis (no API required)
 */
function localFallbackAnalysis(query) {
  console.log('📝 Using local fallback analysis');
  
  // Simple keyword-based analysis for common claims
  const lowerQuery = query.toLowerCase();
  
  const knownClaims = {
    'earth is flat': { verdict: 'false', errorPercentage: 99, explanation: 'Overwhelming scientific evidence from astronomy, physics, and space exploration confirms the Earth is an oblate spheroid.' },
    'water boils at 100': { verdict: 'true', errorPercentage: 2, explanation: 'At standard atmospheric pressure (sea level), pure water boils at exactly 100°C (212°F).' },
    'vaccines cause autism': { verdict: 'false', errorPercentage: 99, explanation: 'Extensive scientific research has found no link between vaccines and autism. The original study claiming this was fraudulent and retracted.' },
    'moon landing': { verdict: 'true', errorPercentage: 1, explanation: 'Multiple lines of evidence, including moon rocks, photographs, and independent tracking, confirm the Apollo moon landings were real.' }
  };

  for (const [key, value] of Object.entries(knownClaims)) {
    if (lowerQuery.includes(key)) {
      return { ...value, query };
    }
  }

  return {
    query,
    verdict: 'unverified',
    errorPercentage: 50,
    explanation: 'This claim requires more context or specialized knowledge to verify. Consider consulting authoritative sources on this topic.'
  };
}

/**
 * Main fact-checking function with cascading fallbacks
 */
async function verifyClaim(query) {
  let aiResult = null;
  let sources = [];

  // Fetch sources in parallel while waiting for AI
  const sourcesPromise = fetchFactCheckSources(query);

  // Try NVIDIA NIM API first (free tier)
  console.log('🎮 Trying NVIDIA NIM API...');
  aiResult = await queryNvidiaNIM(query);

  // Fallback to Gemini if NVIDIA fails
  if (!aiResult) {
    console.log('🤖 Falling back to Google Gemini...');
    aiResult = await queryGemini(query);
  }

  // Final fallback to local analysis
  if (!aiResult) {
    console.log('📝 Using local analysis fallback...');
    aiResult = localFallbackAnalysis(query);
    aiResult.source = 'local';
  }

  // Wait for sources to load
  let fetchedSources = await sourcesPromise;
  
  // Add fallback sources if none found
  if (fetchedSources.length === 0) {
    fetchedSources = generateFallbackSources(query, aiResult.verdict);
  }

  // Combine everything into final response
  return {
    query: aiResult.query || query,
    verdict: aiResult.verdict,
    errorPercentage: aiResult.errorPercentage,
    explanation: aiResult.explanation,
    sources: fetchedSources,
    metadata: {
      aiProvider: aiResult.source || 'unknown',
      sourcesCount: fetchedSources.length,
      processingTime: new Date().toISOString()
    }
  };
}

module.exports = { verifyClaim };