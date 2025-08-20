export default function Reviews() {
  const list = [
    { n: "J. Chen", q: "Saved me over $600/year and explained everything clearly. Highly recommend!" },
    { n: "M. Patel", q: "Got a COI for my landlord the same day. Smooth and professional." },
    { n: "S. Rivera", q: "They found better coverage for my small business at a lower rate." }
  ];
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900">What clients say</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((t, i) => (
            <figure key={i} className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <blockquote className="text-sm text-slate-700">“{t.q}”</blockquote>
              <figcaption className="mt-3 text-xs text-slate-500">— {t.n}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}