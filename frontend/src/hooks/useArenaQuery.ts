import axios from "axios";
import { useCallback } from "react";
import { useArenaStore } from "../store/arenaStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export function useArenaQuery() {
  const {
    prompt,
    referenceAnswer,
    models,
    setLoading,
    setEvaluation,
    setError,
    loading
  } = useArenaStore();

  const runEvaluation = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Prompt is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/arena/evaluate`, {
        prompt,
        referenceAnswer: referenceAnswer.trim() || undefined,
        models
      });

      if (!data?.results?.length) {
        setError("No results returned by backend. Check API keys and selected models.");
        return;
      }

      setEvaluation(data);
    } catch {
      setError("Evaluation failed. Backend did not return live results.");
    } finally {
      setLoading(false);
    }
  }, [models, prompt, referenceAnswer, setError, setEvaluation, setLoading]);

  return { runEvaluation, loading };
}
