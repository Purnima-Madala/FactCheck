// Simulate responses from different AI models with varying hallucination levels
const AI_MODELS = {
  gpt4: {
    name: 'GPT-4',
    icon: 'G',
    color: '#10a37f',
    baseAccuracy: 0.92,
  },
  claude: {
    name: 'Claude 3',
    icon: 'C',
    color: '#7c3aed',
    baseAccuracy: 0.88,
  },
  gemini: {
    name: 'Gemini Pro',
    icon: 'Gm',
    color: '#4285f4',
    baseAccuracy: 0.85,
  }
};

// Predefined claims with ground truth
const CLAIMS_DATABASE = {
  'the moon is made of cheese': {
    groundTruth: {
      verdict: 'false',
      explanation: 'The Moon is a rocky celestial body composed primarily of oxygen, silicon, magnesium, iron, calcium, and aluminum. Scientific analysis of lunar samples confirms no dairy products.',
      sources: [
        { title: 'NASA Lunar Science', url: 'https://moon.nasa.gov' },
        { title: 'Britannica - Moon Composition', url: 'https://britannica.com/place/Moon' }
      ]
    },
    aiResponses: {
      gpt4: { text: 'This claim is false. The Moon is composed of rock and minerals, not cheese.', accuracy: 0.98 },
      claude: { text: 'That is incorrect. The Moon\'s composition is primarily silicate rocks and metals.', accuracy: 0.97 },
      gemini: { text: 'The Moon is made of rock and dust, not cheese. This is a common myth.', accuracy: 0.95 }
    }
  },
  'water boils at 100°c at sea level': {
    groundTruth: {
      verdict: 'true',
      explanation: 'At standard atmospheric pressure (101.325 kPa), pure water boils at exactly 100°C. This is a fundamental physical constant.',
      sources: [
        { title: 'NIST - Boiling Point', url: 'https://nist.gov' },
        { title: 'IUPAC Standards', url: 'https://iupac.org' }
      ]
    },
    aiResponses: {
      gpt4: { text: 'Yes, pure water boils at 100°C at standard sea level atmospheric pressure.', accuracy: 0.99 },
      claude: { text: 'Correct. At sea level with standard pressure, water\'s boiling point is 100°C.', accuracy: 0.98 },
      gemini: { text: 'Water boils at 100 degrees Celsius at sea level pressure.', accuracy: 0.97 }
    }
  },
  'vaccines cause autism': {
    groundTruth: {
      verdict: 'false',
      explanation: 'Extensive scientific research has found no link between vaccines and autism. The original study claiming this was fraudulent and retracted.',
      sources: [
        { title: 'CDC Vaccine Safety', url: 'https://cdc.gov/vaccinesafety' },
        { title: 'WHO Statement', url: 'https://who.int' },
        { title: 'The Lancet Retraction', url: 'https://thelancet.com' }
      ]
    },
    aiResponses: {
      gpt4: { text: 'No, vaccines do not cause autism. Multiple large-scale studies confirm there is no causal relationship.', accuracy: 0.99 },
      claude: { text: 'There is no scientific evidence linking vaccines to autism. This myth stems from a discredited study.', accuracy: 0.97 },
      gemini: { text: 'Vaccines are safe and do not cause autism. The claim has been thoroughly debunked.', accuracy: 0.96 }
    }
  },
  'the earth is flat': {
    groundTruth: {
      verdict: 'false',
      explanation: 'Overwhelming scientific evidence proves Earth is an oblate spheroid. This has been confirmed by satellite imagery, physics, and navigation.',
      sources: [
        { title: 'NASA Earth Observatory', url: 'https://earthobservatory.nasa.gov' },
        { title: 'Scientific American', url: 'https://scientificamerican.com' }
      ]
    },
    aiResponses: {
      gpt4: { text: 'False. Earth is an oblate spheroid, proven by countless observations and measurements.', accuracy: 0.99 },
      claude: { text: 'The Earth is not flat. It is roughly spherical, as demonstrated by numerous scientific methods.', accuracy: 0.98 },
      gemini: { text: 'Earth is round. This has been known for over 2000 years and confirmed by modern science.', accuracy: 0.97 }
    }
  },
  'humans use only 10% of their brain': {
    groundTruth: {
      verdict: 'false',
      explanation: 'This is a popular myth. Neuroimaging shows that humans use virtually all parts of their brain, even during simple tasks.',
      sources: [
        { title: 'Scientific American - Brain Myths', url: 'https://scientificamerican.com' },
        { title: 'Neurology Journal', url: 'https://neurology.org' }
      ]
    },
    aiResponses: {
      gpt4: { text: 'This is a myth. Brain imaging shows we use all parts of our brain, though not all simultaneously.', accuracy: 0.96 },
      claude: { text: 'False. Humans use 100% of their brain, just not all at once.', accuracy: 0.94 },
      gemini: { text: 'You actually use most of your brain most of the time, not just 10%.', accuracy: 0.91 }
    }
  }
};

// Generate realistic AI responses with calculated hallucination scores
export const queryAIModels = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  
  const cleanQuery = query.toLowerCase().trim();
  const claimData = CLAIMS_DATABASE[cleanQuery];
  
  if (!claimData) {
    // Generate fallback response for unknown queries
    return generateFallbackResponse(query);
  }
  
  const responses = {};
  const scores = {};
  
  // Generate responses with realistic variation
  for (const [modelId, modelInfo] of Object.entries(AI_MODELS)) {
    const baseResponse = claimData.aiResponses[modelId];
    if (baseResponse) {
      // Add slight variations to responses
      const variations = [
        baseResponse.text,
        baseResponse.text + ' This is well-established.',
        'Based on current evidence: ' + baseResponse.text.toLowerCase(),
      ];
      
      responses[modelId] = {
        text: variations[Math.floor(Math.random() * variations.length)],
        model: modelInfo.name,
        icon: modelInfo.icon,
        color: modelInfo.color,
      };
      
      // Calculate hallucination score (inverse of accuracy)
      const accuracy = baseResponse.accuracy;
      const hallucinationScore = (1 - accuracy) * 100;
      
      scores[modelId] = {
        errorPercentage: Math.round(hallucinationScore),
        confidence: Math.round(accuracy * 100),
      };
    }
  }
  
  return {
    query,
    responses,
    scores,
    groundTruth: claimData.groundTruth,
    consensusScore: calculateConsensusScore(scores),
  };
};

const generateFallbackResponse = (query) => {
  const responses = {};
  const scores = {};
  
  // Generate plausible but potentially hallucinated responses
  for (const [modelId, modelInfo] of Object.entries(AI_MODELS)) {
    const hallucinationLevel = Math.random() * 0.4 + 0.3; // 30-70% hallucination
    
    responses[modelId] = {
      text: `Based on available information, "${query}" appears to be a claim that requires further verification. I don't have sufficient data to confirm or deny this statement with high confidence.`,
      model: modelInfo.name,
      icon: modelInfo.icon,
      color: modelInfo.color,
    };
    
    scores[modelId] = {
      errorPercentage: Math.round(hallucinationLevel * 100),
      confidence: Math.round((1 - hallucinationLevel) * 100),
    };
  }
  
  return {
    query,
    responses,
    scores,
    groundTruth: {
      verdict: 'unverified',
      explanation: 'This claim could not be verified against our knowledge base. We recommend consulting authoritative sources for accurate information.',
      sources: [],
    },
    consensusScore: calculateConsensusScore(scores),
  };
};

const calculateConsensusScore = (scores) => {
  const values = Object.values(scores);
  const avgConfidence = values.reduce((sum, s) => sum + s.confidence, 0) / values.length;
  return Math.round(avgConfidence);
};