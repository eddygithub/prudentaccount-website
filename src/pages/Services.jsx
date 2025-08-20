export default function Services() {
  const items = [
    { t: "Auto Insurance", d: "Liability, collision, comprehensive, young drivers, multi‑car discounts." },
    { t: "Homeowners", d: "Single family, townhouse, high‑value homes, flood add‑ons." },
    { t: "Condo / Co‑op", d: "Walls‑in coverage, loss assessment, building master policy coordination." },
    { t: "Landlord / Rental", d: "DP‑3, dwelling fire, short‑term rentals, liability protection." },
    { t: "Umbrella", d: "Extra liability for added peace of mind across home & auto." },
    { t: "Business Insurance", d: "General liability, BOP, commercial auto, property, workers’ comp." }
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900">Services</h2>
        <p className="mt-2 text-slate-600">We shop multiple A‑rated carriers to find the right fit and price.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s) => (
            <div key={s.t} className="rounded-xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">✓</span>
                <div>
                  <h3 className="font-semibold text-slate-900">{s.t}</h3>
                  <p className="mt-1 text-sm text-slate-600">{s.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}