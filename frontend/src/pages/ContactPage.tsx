const ContactPage = () => {
  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6 md:p-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Contact</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Reach the team for implementation support, enterprise onboarding, or technical integration questions.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="glass rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold">General Support</h2>
          <p className="mt-2 text-sm text-slate-300">support@factcheckllm.com</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold">Partnerships</h2>
          <p className="mt-2 text-sm text-slate-300">partners@factcheckllm.com</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold">Security Reports</h2>
          <p className="mt-2 text-sm text-slate-300">security@factcheckllm.com</p>
        </article>
      </section>
    </div>
  );
};

export default ContactPage;