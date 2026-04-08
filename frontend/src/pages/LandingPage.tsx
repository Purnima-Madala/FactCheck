import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="space-y-6">
      <section className="glass relative overflow-hidden rounded-3xl p-6 md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
        <p className="relative z-10 mb-3 inline-flex rounded-full border border-cyan-400/35 bg-slate-900/40 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cyan-200">
          Verification Platform
        </p>
        <h1 className="relative z-10 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">
          Fact checking workflows built for high-stakes decisions.
        </h1>
        <p className="relative z-10 mt-4 max-w-2xl text-slate-300 md:text-lg">
          Compare model responses, measure factual confidence, and track hallucination risk with transparent scoring.
        </p>
        <div className="relative z-10 mt-7 flex flex-wrap gap-3">
          <Link
            to="/lab"
            className="rounded-full bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950 transition hover:brightness-110"
          >
            Open Fact Check Lab
          </Link>
          <Link
            to="/about"
            className="rounded-full border border-cyan-400/35 bg-slate-900/50 px-5 py-2.5 font-semibold text-cyan-100 transition hover:bg-slate-800/70"
          >
            Learn Methodology
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="glass rounded-2xl p-5">
          <h2 className="font-display text-xl font-semibold">Evidence First</h2>
          <p className="mt-2 text-sm text-slate-300">
            Run claims through multiple models and compare structured metrics instead of relying on single outputs.
          </p>
        </article>
        <article className="glass rounded-2xl p-5">
          <h2 className="font-display text-xl font-semibold">Transparent Scoring</h2>
          <p className="mt-2 text-sm text-slate-300">
            Correctness, relevance, confidence, and hallucination indicators are exposed for auditability.
          </p>
        </article>
        <article className="glass rounded-2xl p-5">
          <h2 className="font-display text-xl font-semibold">Operational Ready</h2>
          <p className="mt-2 text-sm text-slate-300">
            Designed for teams that need consistent verification standards across research, policy, and reporting.
          </p>
        </article>
      </section>
    </div>
  );
};

export default LandingPage;