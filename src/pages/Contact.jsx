export default function Contact() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Get in touch</h2>
          <p className="mt-2 text-slate-600">Questions, renewals, certificates of insurance—our team is here to help.</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li><span className="font-medium">Phone:</span> <a className="underline" href="tel:+17184459898">(718) 445-9898</a></li>
            <li><span className="font-medium">Email:</span> <a className="underline" href="mailto:info@prudentbrokerage.com">info@prudentbrokerage.com</a></li>
            <li><span className="font-medium">Office:</span> Flushing, NY • Serving all of New York</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Office Hours</h3>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-slate-500">Mon–Fri</dt><dd className="font-medium">9:00 AM – 6:00 PM</dd></div>
            <div><dt className="text-slate-500">Saturday</dt><dd className="font-medium">By appointment</dd></div>
            <div><dt className="text-slate-500">Sunday</dt><dd className="font-medium">Closed</dd></div>
            <div><dt className="text-slate-500">Languages</dt><dd className="font-medium">English, 中文 (Mandarin)</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}