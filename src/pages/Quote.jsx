export default function Quote() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900">Request a Quote</h2>
        <div className="mt-6 max-w-xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <form className="grid grid-cols-1 gap-4">
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="Full name" />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="Email" type="email" />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="Phone" type="tel" />
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option>Coverage type</option>
              <option>Auto</option>
              <option>Homeowners</option>
              <option>Condo / Co-op</option>
              <option>Landlord / Rental</option>
              <option>Umbrella</option>
              <option>Business (GL/BOP)</option>
              <option>Workers’ Comp</option>
            </select>
            <textarea className="min-h-[96px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" placeholder="Tell us briefly what you need" />
            <button type="button" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
              Submit Request
            </button>
            <p className="text-xs text-slate-500">Or email <a className="underline" href="mailto:info@prudentbrokerage.com">info@prudentbrokerage.com</a></p>
          </form>
        </div>
      </div>
    </section>
  );
}