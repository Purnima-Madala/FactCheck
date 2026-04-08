import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6 md:p-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">About Fact Check LLM</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Fact Check LLM is built to make AI responses measurable. The platform helps teams detect weak evidence,
          reduce hallucination risk, and compare model behavior under consistent prompts.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="glass rounded-2xl p-5">
          <h2 className="font-display text-xl font-semibold">How We Evaluate</h2>
          <p className="mt-2 text-sm text-slate-300">
            Outputs are assessed using weighted dimensions: correctness, relevance, confidence calibration, and factual
            safety. This provides a balanced quality profile, not a single vanity score.
          </p>
        </article>
        <article className="glass rounded-2xl p-5">
          <h2 className="font-display text-xl font-semibold">Why It Matters</h2>
          <p className="mt-2 text-sm text-slate-300">
            In policy, legal, healthcare, and research contexts, unsupported answers can create costly risk. Structured
            verification helps teams choose safer model behavior.
          </p>
        </article>
      </section>

      <div>
        <Link
          to="/lab"
          className="inline-flex rounded-full border border-cyan-400/35 bg-slate-900/55 px-5 py-2.5 font-semibold text-cyan-100 transition hover:bg-slate-800/70"
        >
          Go to Fact Check Lab
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;