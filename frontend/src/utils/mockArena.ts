import { MODEL_SELECTION } from "../store/arenaStore";
import type { ArenaModelId, ArenaResponse, ModelResult } from "../types";

const BASELINES: Record<ArenaModelId, Omit<ModelResult, "modelId" | "name" | "compositeScore">> = {
  "openai:gpt-4o": {
    response:
      "The claim is mostly accurate, but it needs context around the source date and sampling method.",
    sources: [
      {
        title: "Fact-checking methodology guide",
        publisher: "Demo Research Notes",
        url: "https://example.com/methodology",
        excerpt: "Use primary sources, date stamps, and sampling details before drawing a conclusion."
      },
      {
        title: "Primary evidence archive",
        publisher: "Demo Evidence Hub",
        url: "https://example.com/evidence",
        excerpt: "Supporting records show the claim is broadly consistent with the underlying data."
      }
    ],
    metrics: {
      hallucinationRate: 12,
      correctnessScore: 91,
      relevanceScore: 88,
      confidenceScore: 86,
      latencyMs: 840,
      tokensUsed: 920
    }
  },
  "anthropic:claude-sonnet": {
    response:
      "The statement is broadly sound, though some details require verification against primary evidence.",
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
    ],
    metrics: {
      hallucinationRate: 10,
      correctnessScore: 89,
      relevanceScore: 90,
      confidenceScore: 84,
      latencyMs: 920,
      tokensUsed: 880
    }
  },
  "google:gemini-1.5-pro": {
    response:
      "This appears accurate overall, with a strong factual core and a moderate need for caveats.",
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
    ],
    metrics: {
      hallucinationRate: 14,
      correctnessScore: 87,
      relevanceScore: 92,
      confidenceScore: 82,
      latencyMs: 760,
      tokensUsed: 940
    }
  },
  "mistral:mistral-large": {
    response:
      "The claim is directionally correct, though a few terms should be checked against the original dataset.",
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
    ],
    metrics: {
      hallucinationRate: 16,
      correctnessScore: 84,
      relevanceScore: 86,
      confidenceScore: 80,
      latencyMs: 700,
      tokensUsed: 760
    }
  },
  "cohere:command-r-plus": {
    response:
      "There is partial support for the statement, but the evidence is not strong enough for full confidence.",
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
    ],
    metrics: {
      hallucinationRate: 19,
      correctnessScore: 79,
      relevanceScore: 83,
      confidenceScore: 78,
      latencyMs: 670,
      tokensUsed: 720
    }
  }
};

function seededScore(seed: number, offset: number, minimum: number, maximum: number) {
  const span = maximum - minimum;
  const value = Math.abs(Math.sin(seed + offset) * 1000) % 1;
  return Math.round(minimum + value * span);
}

function getSeed(prompt: string, referenceAnswer: string) {
  const combined = `${prompt}|${referenceAnswer}`;
  let seed = 0;
  for (let index = 0; index < combined.length; index += 1) {
    seed = (seed * 31 + combined.charCodeAt(index)) % 100000;
  }
  return seed || 1;
}

export function buildMockArenaResponse(prompt: string, referenceAnswer: string, selectedModels: ArenaModelId[]): ArenaResponse {
  const seed = getSeed(prompt, referenceAnswer);
  const orderedModels = selectedModels.length ? selectedModels : MODEL_SELECTION.map((item) => item.id);

  const results: ModelResult[] = orderedModels.map((modelId, index) => {
    const model = MODEL_SELECTION.find((item) => item.id === modelId)!;
    const baseline = BASELINES[modelId];
    const jitter = index * 17;
    const correctnessScore = clamp(baseline.metrics.correctnessScore + seededScore(seed, jitter + 1, -4, 4));
    const relevanceScore = clamp(baseline.metrics.relevanceScore + seededScore(seed, jitter + 2, -4, 4));
    const confidenceScore = clamp(baseline.metrics.confidenceScore + seededScore(seed, jitter + 3, -5, 5));
    const hallucinationRate = clamp(baseline.metrics.hallucinationRate + seededScore(seed, jitter + 4, -3, 3), 0, 100);
    const latencyMs = baseline.metrics.latencyMs + seededScore(seed, jitter + 5, -60, 90);
    const tokensUsed = baseline.metrics.tokensUsed + seededScore(seed, jitter + 6, -45, 85);
    const compositeScore = Number(
      (correctnessScore * 0.38 + relevanceScore * 0.28 + confidenceScore * 0.22 + (100 - hallucinationRate) * 0.12).toFixed(2)
    );

    return {
      modelId,
      name: model.name,
      response: baseline.response,
      sources: baseline.sources,
      metrics: {
        correctnessScore,
        relevanceScore,
        confidenceScore,
        hallucinationRate,
        latencyMs,
        tokensUsed
      },
      compositeScore
    };
  });

  results.sort((a, b) => b.compositeScore - a.compositeScore);

  return {
    results,
    winner: results[0]?.modelId || "",
    evaluatedAt: new Date().toISOString(),
    recommendedAnswer: buildRecommendedAnswer(results, prompt),
    recommendedSources: results.slice(0, 3).flatMap((item) => item.sources).slice(0, 4)
  };
}

function clamp(value: number, minimum = 0, maximum = 100) {
  return Math.min(maximum, Math.max(minimum, value));
}

function buildRecommendedAnswer(results: ModelResult[], prompt: string) {
  if (!results.length) {
    return "No recommendation available yet.";
  }

  const top = results[0];
  const nextBest = results[1];
  const caveat = nextBest && nextBest.compositeScore > top.compositeScore - 3 ? " with a small confidence margin" : "";

  return `Recommended answer for \"${prompt}\": ${top.response} This is the most trustable answer${caveat} because it leads on correctness, relevance, and lower hallucination risk.`;
}
