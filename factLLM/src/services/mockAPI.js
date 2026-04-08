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
        relevance: 0.99
      },
      {
        title: "Britannica – Moon",
        url: "https://www.britannica.com/place/Moon",
        excerpt: "The Moon is a solid rocky body with a differentiated structure.",
        relevance: 0.95
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
        relevance: 1.0
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
        relevance: 0.99
      },
      {
        title: "WHO – Vaccines and Autism",
        url: "https://www.who.int/news-room/questions-and-answers/item/vaccines-and-autism",
        excerpt: "No evidence of a link between measles-mumps-rubella (MMR) vaccine and autism.",
        relevance: 0.98
      }
    ],
    explanation: "The original study claiming a link has been retracted and is fraudulent. Extensive research confirms vaccines do not cause autism."
  }
];

export const factCheck = async (query) => {
  // Simulate network delay
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
  
  // Fallback for unverified claims
  return {
    query: query,
    verdict: "unverified",
    confidence: 0.5,
    errorPercentage: 50,
    sources: [],
    explanation: "This claim could not be verified against our knowledge base. We recommend checking trusted sources manually."
  };
};