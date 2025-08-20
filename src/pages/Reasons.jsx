export default function Reasons() {
  const pts = [
    { t: "Local expertise", d: "Based in Queens/Long Island area—licensed agents who know NY risks & regulations." },
    { t: "Carrier choice", d: "We compare multiple top‑rated carriers to tailor coverage and price." },
    { t: "Service that cares", d: "Annual reviews, quick COIs, claim support when you need it most." }
  ];
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900">Why choose Prudent</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pts.map((i) => (
            <div key={i.t} className="rounded-xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <h3 className="font-semibold text-slate-900">{i.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{i.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}