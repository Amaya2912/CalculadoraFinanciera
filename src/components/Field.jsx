import { useId } from 'react'

const estilo = 'h-12 w-full rounded-lg border border-slate-400 bg-white px-3.5'

export default function Field({ field, value, onChange }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">{field.label}</label>
      {field.options ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={estilo}>
          {field.options.map((o, k) => <option key={o} value={k}>{o}</option>)}
        </select>
      ) : (
        <input id={id} inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className={estilo} />
      )}
    </div>
  )
}
