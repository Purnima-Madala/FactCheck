import { useArenaQuery } from "../../hooks/useArenaQuery";
import { MODEL_SELECTION, useArenaStore } from "../../store/arenaStore";

export function PromptInput() {
  const {
    prompt,
    referenceAnswer,
    models,
    setPrompt,
    setReferenceAnswer,
    toggleModel,
    error
  } = useArenaStore();
  const { runEvaluation, loading } = useArenaQuery();

  return (
    <section className="glass rounded-[24px] p-5 md:p-6">
      <h2 className="mb-2 font-display text-2xl text-slate-900">Fact Check Lab</h2>
      <p className="mb-5 text-slate-600">
        Benchmark multiple models side-by-side to find the most trustworthy response.
      </p>

      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={5}
        className="w-full rounded-2xl border border-sky-100 bg-sky-50/70 px-3 py-3 text-sm text-slate-800 outline-none ring-sky-200/70 focus:ring"
        placeholder="Enter a claim, question, or statement to fact check..."
      />

      <textarea
        value={referenceAnswer}
        onChange={(event) => setReferenceAnswer(event.target.value)}
        rows={3}
        className="mt-4 w-full rounded-2xl border border-teal-100 bg-teal-50/60 px-3 py-3 text-sm text-slate-800 outline-none ring-teal-200/70 focus:ring"
        placeholder="Optional reference answer (known truth baseline)"
      />

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
        {MODEL_SELECTION.map((model) => (
          <label
            key={model.id}
            className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white/75 px-3 py-2.5 text-xs text-slate-700 shadow-sm"
          >
            <input
              type="checkbox"
              checked={models.includes(model.id)}
              onChange={() => toggleModel(model.id)}
            />
            <span style={{ color: model.color }}>{model.name}</span>
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void runEvaluation()}
          disabled={loading}
          className="rounded-full bg-sky-200 px-5 py-2 font-display font-semibold text-slate-900 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Checking Facts..." : "Find Truth"}
        </button>
        {error ? <span className="text-sm text-rose-500">{error}</span> : null}
      </div>
    </section>
  );
}
