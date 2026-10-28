export default function Chips({ label, options, value, onChange }) {
  return (
    <div className="mb-6">
      <div className="mb-2 text-sm font-medium">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o, k) => (
          <button
            key={o}
            type="button"
            aria-pressed={k === value}
            onClick={() => onChange(k)}
            className={`h-11 rounded-full border px-4 text-sm ${k === value ? 'border-brand bg-brand text-white' : 'border-slate-400 bg-white hover:bg-tint'}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
