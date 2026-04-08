// Simulated API response – will be replaced with real backend later
const mockDatabase = [
  {
    id: 1,
    text: "The moon is made of cheese",
    verdict: "false",
    errorScore: 0.98,
    sources: [
      {
        title: "NASA Moon Facts",
        url: "https://moon.nasa.gov/about/what-is-inside-the-moon/",
        excerpt: "The Moon's crust is mainly composed of oxygen, silicon, magnesium, iron, calcium, and aluminum. No cheese detected.",
        relevance: 0.99,
        reliability: "high",
        date: "2024-04-08"
      },
      {
        title: "Britannica – Moon",
        url: "https://www.britannica.com/place/Moon",
        excerpt: "The Moon is a solid rocky body with a differentiated structure.",
        relevance: 0.95,
        reliability: "high",
        date: "2024-04-07"
      }
    ],
    explanation: "The claim that the Moon is made of cheese is a well-known myth with no scientific basis. Lunar samples confirm a rocky composition."
  },
  {
    id: 2,
    text: "Water boils at 100°C at sea level",
    verdict: "true",
    errorScore: 0.02,
    sources: [
      {
        title: "NIST – Boiling Point of Water",
        url: "https://www.nist.gov/pml/weights-and-measures/si-units-temperature",
        excerpt: "At standard atmospheric pressure (101.325 kPa), pure water boils at exactly 100 °C.",
        relevance: 1.0,
        reliability: "high",
        date: "2024-04-08"
      }
    ],
    explanation: "This is a fundamental physical property of water under standard conditions."
  },
  {
    id: 3,
    text: "Vaccines cause autism",
    verdict: "false",
    errorScore: 0.99,
    sources: [
      {
        title: "CDC – Vaccine Safety",
        url: "https://www.cdc.gov/vaccinesafety/concerns/autism.html",
        excerpt: "Many studies have looked at whether there is a relationship between vaccines and autism. The evidence shows no link.",
        relevance: 0.99,
        reliability: "high",
        date: "2024-04-08"
      },
      {
        title: "WHO – Vaccines and Autism",
        url: "https://www.who.int/news-room/questions-and-answers/item/vaccines-and-autism",
        excerpt: "No evidence of a link between measles-mumps-rubella (MMR) vaccine and autism.",
        relevance: 0.98,
        reliability: "high",
        date: "2024-04-07"
      }
    ],
    explanation: "The original study claiming a link has been retracted and is fraudulent. Extensive research confirms vaccines do not cause autism."
  }
];

const buildModelResponses = (normalizedQuery, verdict) => {
  const baseResponses = {
    moon: {
      "GPT-4": "No, the moon is not made of cheese. Scientific evidence shows it is made of rock and metal.",
      "Claude": "The Moon is composed of silicate minerals and metal, not dairy products.",
      "Gemini": "This is a myth; lunar geology confirms the Moon is rocky and not cheese.",
      "LLaMA": "Lunar samples and missions prove the Moon is not made of cheese."
    },
    water: {
      "GPT-4": "Yes, under standard sea-level conditions, water boils at 100°C.",
      "Claude": "At one atmosphere of pressure, pure water boils at 100°C.",
      "Gemini": "Water boils at 100 degrees Celsius at sea level, which is standard physics.",
      "LLaMA": "At sea level, the boiling point of water is 100°C for pure water."
    },
    vaccines: {
      "GPT-4": "No, vaccines do not cause autism. Multiple studies have disproven that link.",
      "Claude": "The claim is false; comprehensive research finds no connection between vaccines and autism.",
      "Gemini": "There is no scientific evidence that vaccines cause autism.",
      "LLaMA": "Vaccines are safe and are not linked to autism according to experts."
    }
  };

  if (normalizedQuery.includes('moon')) return baseResponses.moon;
  if (normalizedQuery.includes('water')) return baseResponses.water;
  if (normalizedQuery.includes('vaccine') || normalizedQuery.includes('autism')) return baseResponses.vaccines;

  return {
    "GPT-4": "This claim could not be verified with the current dataset. Consider checking trusted sources.",
    "Claude": "No direct match found. The claim may require manual verification.",
    "Gemini": "The statement is not found in our knowledge base; cross-check with reliable sources.",
    "LLaMA": "Unable to verify this claim automatically. Consult authoritative references."
  };
};

const buildModelScores = (verdict) => {
  if (verdict === 'true') {
    return {
      "GPT-4": 98,
      "Claude": 95,
      "Gemini": 91,
      "LLaMA": 88
    };
  }

  if (verdict === 'false') {
    return {
      "GPT-4": 92,
      "Claude": 89,
      "Gemini": 75,
      "LLaMA": 81
    };
  }

  return {
    "GPT-4": 82,
    "Claude": 79,
    "Gemini": 69,
    "LLaMA": 64
  };
};

export const factCheck = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const cleanQuery = query.trim().toLowerCase();
  const match = mockDatabase.find(claim => claim.text.toLowerCase() === cleanQuery);

  if (match) {
    return {
      query: match.text,
      verdict: match.verdict,
      confidence: 1 - match.errorScore,
      errorPercentage: Math.round(match.errorScore * 100),
      sources: match.sources,
      explanation: match.explanation
    };
  }

  return {
    query,
    verdict: 'unverified',
    confidence: 0.5,
    errorPercentage: 50,
    sources: [
      {
        title: 'General Fact-Checking Guide',
        url: 'https://en.wikipedia.org/wiki/Fact-checking',
        excerpt: 'Use trusted sources and verified experts to confirm claims that cannot be matched automatically.',
        relevance: 0.8,
        reliability: 'medium',
        date: '2024-04-08'
      }
    ],
    explanation: 'This claim could not be verified against our knowledge base. We recommend checking trusted sources manually.'
  };
};

export const queryAIModels = async (query) => {
  const analysis = await factCheck(query);
  const normalizedQuery = query.trim().toLowerCase();
  const responses = buildModelResponses(normalizedQuery, analysis.verdict);
  const scores = buildModelScores(analysis.verdict);
  const consensusScore = Math.round(Object.values(scores).reduce((sum, value) => sum + value, 0) / Object.values(scores).length);

  return {
    originalQuery: analysis.query,
    responses,
    scores,
    groundTruth: {
      isTrue: analysis.verdict === 'true',
      explanation: analysis.explanation,
      sources: analysis.sources
    },
    consensusScore
  };
};