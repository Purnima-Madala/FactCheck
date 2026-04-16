import { Router } from "express";
import { openAIAdapter } from "./adapters/openai.js";
import { anthropicAdapter } from "./adapters/anthropic.js";
import { geminiAdapter } from "./adapters/gemini.js";
import { mistralAdapter } from "./adapters/mistral.js";
import { cohereAdapter } from "./adapters/cohere.js";
import { nvidiaAdapter } from "./adapters/nvidia.js";
import { scoreResponses } from "./engine/scoringEngine.js";
import { buildMockRawResult, buildRecommendation, getMockModelMeta } from "./mockArena.js";

const adapterRegistry = new Map(
  [openAIAdapter, anthropicAdapter, geminiAdapter, nvidiaAdapter, mistralAdapter, cohereAdapter].map(
    (adapter) => [adapter.modelId, adapter]
  )
);

const defaultModelIds = [...adapterRegistry.keys()];

export const arenaRouter = Router();

arenaRouter.post("/api/arena/evaluate", async (req, res, next) => {
  try {
    const { prompt, referenceAnswer, models } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "'prompt' is required and must be a string." });
      return;
    }

    const selectedModels = Array.isArray(models) && models.length ? models : defaultModelIds;
    const selectedAdapters = selectedModels.map((modelId) => adapterRegistry.get(modelId)).filter(Boolean);

    if (!selectedAdapters.length) {
      res.status(400).json({ error: "No valid models selected." });
      return;
    }

    const rawItems = await Promise.all(
      selectedModels.map(async (modelId) => {
        const adapter = adapterRegistry.get(modelId);

        if (!adapter) {
          return buildMockRawResult(modelId, prompt);
        }

        if (!adapter.isConfigured) {
          return buildMockRawResult(modelId, prompt);
        }

        try {
          const result = await adapter.fetchResponse(prompt);
          return {
            modelId: adapter.modelId,
            name: adapter.name,
            response: result.text,
            latencyMs: result.latencyMs,
            tokensUsed: result.tokensUsed,
            rawMetadata: result.rawMetadata
          };
        } catch (error) {
          const fallback = buildMockRawResult(modelId, prompt);
          return {
            ...fallback,
            error: error?.message || "Model request failed"
          };
        }
      })
    );

    const scored = scoreResponses(rawItems, prompt, referenceAnswer).map((item) => {
      const raw = rawItems.find((entry) => entry.modelId === item.modelId);
      const providerSources = extractSourcesFromMetadata(raw?.rawMetadata);

      return {
        ...item,
        sources: providerSources.length ? providerSources : getMockModelMeta(item.modelId).sources,
        sourceMode: providerSources.length ? "provider" : "mock"
      };
    });

    const results = scored.sort((a, b) => b.compositeScore - a.compositeScore);

    const winner = results[0]?.modelId || "";
    const recommendation = buildRecommendation(results, prompt);

    res.json({
      results,
      winner,
      evaluatedAt: new Date().toISOString(),
      recommendedAnswer: recommendation.recommendedAnswer,
      recommendedSources: recommendation.recommendedSources,
      scoringBasis: {
        correctness: referenceAnswer
          ? "Compared against your reference answer using token-overlap similarity."
          : "Compared against cross-model consensus when no reference answer is provided.",
        hallucination:
          "Estimated from unique claims that contradict consensus statements across model outputs.",
        composite:
          "Composite = correctness 35% + relevance 25% + factual safety (100-hallucination) 25% + confidence 15%."
      }
    });
  } catch (error) {
    next(error);
  }
});

function extractSourcesFromMetadata(rawMetadata) {
  if (!rawMetadata || rawMetadata.mocked) {
    return [];
  }

  const chunks = rawMetadata.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!Array.isArray(chunks)) {
    return [];
  }

  return chunks
    .map((chunk) => {
      const web = chunk?.web;
      if (!web?.uri) {
        return null;
      }

      return {
        title: web.title || "Provider citation",
        publisher: "Provider metadata",
        url: web.uri,
        excerpt: "Citation returned directly by model provider metadata."
      };
    })
    .filter(Boolean);
}
