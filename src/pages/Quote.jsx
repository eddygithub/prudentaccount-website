import { useMemo, useState } from "react";
import Field from "@/components/form/Field";
import api from "@/lib/api";
import { CONTACT_FIELDS, COVERAGE_SCHEMAS, buildPayload } from "@/data/quoteSchemas";

export default function Quote() {
  const [coverage, setCoverage] = useState("Homeowners");
  const [contact, setContact] = useState(() => objectFromFields(CONTACT_FIELDS));
  const [values, setValues] = useState(() => objectFromFields(COVERAGE_SCHEMAS["Homeowners"]));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const coverageOptions = Object.keys(COVERAGE_SCHEMAS);

  const schema = useMemo(() => COVERAGE_SCHEMAS[coverage] || [], [coverage]);

  function objectFromFields(fields = []) {
    const o = {};
    for (const f of fields) {
      // checkbox default false; others empty
      o[f.id] = f.type === "checkbox" ? false : "";
    }
    return o;
  }

  function updateContact(id, v) {
    setContact((prev) => ({ ...prev, [id]: v }));
  }

  function updateValue(id, v) {
    // apply mask if provided (e.g., EIN)
    const field = (schema || []).find((f) => f.id === id);
    const masked = field?.mask ? field.mask(v) : v;
    setValues((prev) => ({ ...prev, [id]: masked }));
  }

  function visibleFields(fields, allValues) {
    return fields.filter((f) => (typeof f.showIf === "function" ? !!f.showIf(allValues) : true));
  }

  function handleCoverageChange(next) {
    setCoverage(next);
    setValues(objectFromFields(COVERAGE_SCHEMAS[next]));
    setOk(false);
    setError("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setOk(false);
    try {
      const payload = buildPayload(coverage, contact, values);
      await api.postJSON("/quotes/submit", payload);
      setOk(true);
    } catch (e) {
      setError(e.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900">Request a Quote</h2>

        <div className="mt-6 max-w-2xl rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <form className="grid grid-cols-1 gap-4" onSubmit={onSubmit}>
            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTACT_FIELDS.map((f) => (
                <Field key={f.id} field={f} value={contact[f.id]} onChange={updateContact} />
              ))}
            </div>

            {/* Coverage selector */}
            <label className="text-sm text-slate-700">
              Coverage type
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                value={coverage}
                onChange={(e) => handleCoverageChange(e.target.value)}
              >
                {coverageOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            {/* Dynamic fields */}
            {visibleFields(schema, values).map((f) => (
              <Field key={f.id} field={f} value={values[f.id]} onChange={updateValue} />
            ))}

            {/* Submit */}
            <div className="mt-2 grid gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
              <p className="text-xs text-slate-500">
                Or email{" "}
                <a className="underline" href="mailto:info@prudentbrokerage.com">
                  info@prudentbrokerage.com
                </a>
              </p>
              {error && <p className="text-xs text-red-600">{error}</p>}
              {ok && <p className="text-xs text-emerald-600">Thanks! We’ll get back to you shortly.</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
