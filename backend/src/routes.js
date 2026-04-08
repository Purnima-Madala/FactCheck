import { Router } from "express";
import { openAIAdapter } from "./adapters/openai.js";
import { anthropicAdapter } from "./adapters/anthropic.js";
import { geminiAdapter } from "./adapters/gemini.js";
import { mistralAdapter } from "./adapters/mistral.js";
import { cohereAdapter } from "./adapters/cohere.js";
import { scoreResponses } from "./engine/scoringEngine.js";

const adapterRegistry = new Map(
  [openAIAdapter, anthropicAdapter, geminiAdapter, mistralAdapter, cohereAdapter].map(
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
    const selectedAdapters = selectedModels
      .map((modelId) => adapterRegistry.get(modelId))
      .filter(Boolean);

    if (!selectedAdapters.length) {
      res.status(400).json({ error: "No valid models selected." });
      return;
    }

    const settled = await Promise.allSettled(
      selectedAdapters.map(async (adapter) => {
        const result = await adapter.fetchResponse(prompt);
        return {
          modelId: adapter.modelId,
          name: adapter.name,
          ...result
        };
      })
    );

    const successful = [];
    const failed = [];

    settled.forEach((item, index) => {
      const adapter = selectedAdapters[index];
      if (item.status === "fulfilled") {
        successful.push(item.value);
      } else {
        failed.push({
          modelId: adapter.modelId,
          name: adapter.name,
          response: "",
          metrics: {
            hallucinationRate: 100,
            correctnessScore: 0,
            relevanceScore: 0,
            confidenceScore: 0,
            latencyMs: 0,
            tokensUsed: 0
          },
          compositeScore: 0,
          error: item.reason?.message || "Model request failed"
        });
      }
    });

    const scored = successful.length
      ? scoreResponses(successful, prompt, referenceAnswer)
      : [];

    const results = [...scored, ...failed].sort(
      (a, b) => b.compositeScore - a.compositeScore
    );

    const winner = scored.length
      ? scored.reduce((best, current) =>
          current.compositeScore > best.compositeScore ? current : best
        ).modelId
      : "";

    res.json({
      results,
      winner,
      evaluatedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});
