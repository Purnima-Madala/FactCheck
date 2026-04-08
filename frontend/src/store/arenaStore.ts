import { create } from "zustand";
import type { ArenaModelId, ModelResult } from "../types";

export const MODEL_SELECTION: { id: ArenaModelId; name: string; color: string }[] = [
  { id: "openai:gpt-4o", name: "OpenAI GPT-4o", color: "#00F5FF" },
  { id: "anthropic:claude-sonnet", name: "Claude Sonnet", color: "#38bdf8" },
  { id: "google:gemini-1.5-pro", name: "Gemini 1.5 Pro", color: "#f59e0b" },
  { id: "mistral:mistral-large", name: "Mistral Large", color: "#14b8a6" },
  { id: "cohere:command-r-plus", name: "Cohere Command R+", color: "#94a3b8" }
];

interface ArenaState {
  prompt: string;
  referenceAnswer: string;
  models: ArenaModelId[];
  loading: boolean;
  results: ModelResult[];
  winner: string;
  evaluatedAt: string;
  recommendedAnswer: string;
  recommendedSources: { title: string; publisher: string; url: string; excerpt: string }[];
  error: string | null;
  setPrompt: (value: string) => void;
  setReferenceAnswer: (value: string) => void;
  toggleModel: (modelId: ArenaModelId) => void;
  setLoading: (loading: boolean) => void;
  setEvaluation: (payload: {
    results: ModelResult[];
    winner: string;
    evaluatedAt: string;
    recommendedAnswer: string;
    recommendedSources: { title: string; publisher: string; url: string; excerpt: string }[];
  }) => void;
  setError: (error: string | null) => void;
}

export const useArenaStore = create<ArenaState>((set) => ({
  prompt: "",
  referenceAnswer: "",
  models: MODEL_SELECTION.map((item) => item.id),
  loading: false,
  results: [],
  winner: "",
  evaluatedAt: "",
  recommendedAnswer: "",
  recommendedSources: [],
  error: null,
  setPrompt: (value) => set({ prompt: value }),
  setReferenceAnswer: (value) => set({ referenceAnswer: value }),
  toggleModel: (modelId) =>
    set((state) => {
      const exists = state.models.includes(modelId);
      const models = exists
        ? state.models.filter((id) => id !== modelId)
        : [...state.models, modelId];

      return {
        models: models.length ? models : state.models
      };
    }),
  setLoading: (loading) => set({ loading }),
  setEvaluation: (payload) =>
    set({
      results: payload.results,
      winner: payload.winner,
      evaluatedAt: payload.evaluatedAt,
      recommendedAnswer: payload.recommendedAnswer,
      recommendedSources: payload.recommendedSources,
      error: null
    }),
  setError: (error) => set({ error })
}));
