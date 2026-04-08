import { useCallback } from "react";
import { useArenaStore } from "../store/arenaStore";
import { buildMockArenaResponse } from "../utils/mockArena";

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
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      const data = buildMockArenaResponse(prompt, referenceAnswer.trim(), models);
      setEvaluation(data);
    } catch {
      setError("Evaluation failed.");
    } finally {
      setLoading(false);
    }
  }, [models, prompt, referenceAnswer, setError, setEvaluation, setLoading]);

  return { runEvaluation, loading };
}
