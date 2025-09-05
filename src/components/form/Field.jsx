// src/components/form/Field.jsx
export default function Field({ field, value, onChange }) {
  const { id, type, label, required, placeholder, options, multiple, inputMode } = field;

  if (type === "select") {
    return (
      <label className="text-sm text-slate-700">
        {label}
        <select
          id={id}
          multiple={!!multiple}
          value={multiple ? (value || []) : (value ?? "")}
          onChange={(e) => {
            if (multiple) {
              const vals = Array.from(e.target.selectedOptions).map(o => o.value);
              onChange(id, vals);
            } else {
              onChange(id, e.target.value);
            }
          }}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
          {!multiple && <option value="">Select…</option>}
          {(options || []).map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>
    );
  }

  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(id, e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        {label}
      </label>
    );
  }

  if (type === "textarea") {
    return (
      <label className="text-sm text-slate-700">
        {label}
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          className="mt-1 min-h-[96px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
      </label>
    );
  }

  // text, email, tel, date, time, etc.
  return (
    <label className="text-sm text-slate-700">
      {label}
      <input
        type={type || "text"}
        inputMode={inputMode}
        required={required}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(id, e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
    </label>
  );
}
