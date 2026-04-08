const MOCK_MODELS = {
  "openai:gpt-4o": {
    name: "OpenAI GPT-4o",
    response: "The claim is mostly accurate, but it needs context around the source date and sampling method.",
    latencyMs: 820,
    tokensUsed: 910,
    sources: [
      {
        title: "Methodology note",
        publisher: "Demo Evidence Hub",
        url: "https://example.com/methodology",
        excerpt: "Use primary sources, date stamps, and sampling details before drawing a conclusion."
      },
      {
        title: "Evidence snapshot",
        publisher: "Demo Research Notes",
        url: "https://example.com/evidence",
        excerpt: "Supporting records show the claim is broadly consistent with the underlying data."
      }
    ]
  },
  "anthropic:claude-sonnet": {
    name: "Anthropic Claude Sonnet",
    response: "The statement is broadly sound, though some details require verification against primary evidence.",
    latencyMs: 900,
    tokensUsed: 860,
    sources: [
      {
        title: "Evidence review summary",
        publisher: "Demo Research Notes",
        url: "https://example.com/evidence-review",
        excerpt: "The key details align with the reference record, but edge cases need caution."
      },
      {
        title: "Source comparison brief",
        publisher: "Demo Evidence Hub",
        url: "https://example.com/source-brief",
        excerpt: "Independent sources agree on the core claim while differing on minor framing."
      }
    ]
  },
  "google:gemini-1.5-pro": {
    name: "Google Gemini 1.5 Pro",
    response: "This appears accurate overall, with a strong factual core and a moderate need for caveats.",
    latencyMs: 760,
    tokensUsed: 940,
    sources: [
      {
        title: "Cross-source verification table",
        publisher: "Demo Evidence Hub",
        url: "https://example.com/verification-table",
        excerpt: "Corroboration is strong, but the claim should keep a brief caveat for context."
      },
      {
        title: "Reference statement digest",
        publisher: "Demo Research Notes",
        url: "https://example.com/reference-digest",
        excerpt: "Primary evidence supports the main assertion with limited ambiguity."
      }
    ]
  },
  "nvidia:llama-3.1-8b-instruct": {
    name: "NVIDIA Llama 3.1 8B Instruct",
    response: "The claim is directionally correct, though several details should be checked against a primary source.",
    latencyMs: 640,
    tokensUsed: 780,
    sources: [
      {
        title: "Model evidence summary",
        publisher: "Demo Research Notes",
        url: "https://example.com/nvidia-summary",
        excerpt: "The answer is plausible but still benefits from a clearer source trail."
      },
      {
        title: "Cross-check note",
        publisher: "Demo Evidence Hub",
        url: "https://example.com/cross-check",
        excerpt: "Supporting context is present, but not enough to remove every uncertainty."
      }
    ]
  },
  "mistral:mistral-large": {
    name: "Mistral Large",
    response: "The claim is directionally correct, though a few terms should be checked against the original dataset.",
    latencyMs: 700,
    tokensUsed: 760,
    sources: [
      {
        title: "Dataset consistency memo",
        publisher: "Demo Research Notes",
        url: "https://example.com/dataset-memo",
        excerpt: "The statement matches the dataset trend but not every specific term."
      },
      {
        title: "Evidence alignment sheet",
        publisher: "Demo Evidence Hub",
        url: "https://example.com/alignment-sheet",
        excerpt: "Most indicators support the statement once terminology is normalized."
      }
    ]
  },
  "cohere:command-r-plus": {
    name: "Cohere Command R+",
    response: "There is partial support for the statement, but the evidence is not strong enough for full confidence.",
    latencyMs: 670,
    tokensUsed: 720,
    sources: [
      {
        title: "Partial support summary",
        publisher: "Demo Research Notes",
        url: "https://example.com/partial-support",
        excerpt: "Useful supporting evidence exists, but it does not close all gaps."
      },
      {
        title: "Claims review checklist",
        publisher: "Demo Evidence Hub",
        url: "https://example.com/checklist",
        excerpt: "Additional corroboration is needed before treating the claim as fully verified."
      }
    ]
  }
};

export function getMockModelMeta(modelId) {
  return MOCK_MODELS[modelId] || {
    name: modelId,
    response: "No mock response available for this model.",
    latencyMs: 600,
    tokensUsed: 500,
    sources: [
      {
        title: "Mock fallback",
        publisher: "Demo Evidence Hub",
        url: "https://example.com/mock",
        excerpt: "A demo fallback was used because no live provider was configured."
      }
    ]
  };
}

export function buildMockRawResult(modelId, prompt) {
  const meta = getMockModelMeta(modelId);
  const seed = seedFromText(`${modelId}|${prompt}`);

  return {
    modelId,
    name: meta.name,
    response: meta.response,
    latencyMs: meta.latencyMs + (seed % 80),
    tokensUsed: meta.tokensUsed + (seed % 65),
    rawMetadata: { mocked: true },
    sources: meta.sources
  };
}

export function buildRecommendation(results, prompt) {
  if (!results.length) {
    return {
      recommendedAnswer: "No recommendation available yet.",
      recommendedSources: []
    };
  }

  const top = results[0];
  const nextBest = results[1];
  const caveat = nextBest && nextBest.compositeScore > top.compositeScore - 3 ? " with a small confidence margin" : "";

  return {
    recommendedAnswer: `Recommended answer for "${prompt}": ${top.response} This is the most trustable answer${caveat} because it leads on correctness, relevance, and lower hallucination risk.`,
    recommendedSources: results.slice(0, 3).flatMap((item) => item.sources || []).slice(0, 4)
  };
}

function seedFromText(text) {
  let seed = 0;
  for (let index = 0; index < text.length; index += 1) {
    seed = (seed * 31 + text.charCodeAt(index)) % 100000;
  }
  return seed;
}