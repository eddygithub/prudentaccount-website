export default function Carriers() {
  const names = ["Travelers","Progressive","Safeco","Nationwide","Chubb","The Hartford","Liberty Mutual","Allstate"];
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900">Carrier partners</h2>
        <p className="mt-2 text-slate-600">Sample of the A‑rated companies we work with.</p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {names.map((name) => (
            <div key={name} className="h-16 rounded-xl bg-white ring-1 ring-slate-200 grid place-items-center text-sm font-medium text-slate-700">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}