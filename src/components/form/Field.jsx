export default function Field({ field, value, onChange }) {
  const base =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

  const { id, type = "text", label, placeholder, options, inputMode, required } = field;

  if (type === "textarea") {
    return (
      <label className="text-sm text-slate-700">
        {label}
        <textarea
          className={`mt-1 min-h-[96px] ${base}`}
          placeholder={placeholder || label}
          value={value ?? ""}
          onChange={(e) => onChange(id, e.target.value)}
          required={required}
        />
      </label>
    );
  }

  if (type === "select") {
    return (
      <label className="text-sm text-slate-700">
        {label}
        <select
          className={`mt-1 ${base}`}
          value={value ?? ""}
          onChange={(e) => onChange(id, e.target.value)}
          required={required}
        >
          {(options || []).map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (type === "checkbox") {
    return (
      <label className="text-sm text-slate-700 inline-flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          checked={!!value}
          onChange={(e) => onChange(id, e.target.checked)}
        />
        {label}
      </label>
    );
  }

  // text, email, tel, date, number
  return (
    <label className="text-sm text-slate-700">
      {label}
      <input
        type={type}
        inputMode={inputMode}
        className={`mt-1 ${base}`}
        placeholder={placeholder || label}
        value={value ?? ""}
        onChange={(e) => onChange(id, e.target.value)}
        required={required}
      />
    </label>
  );
}
