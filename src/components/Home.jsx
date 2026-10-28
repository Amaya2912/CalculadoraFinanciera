import NumBadge from './NumBadge'
import PageHeader from './PageHeader'

export default function Home({ modules, onSelect }) {
  return (
    <>
      <PageHeader title="Calculadora de Ingeniería Económica" subtitle="Elige un módulo para empezar." />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {modules.map((m, k) => (
          <button key={m.id} onClick={() => onSelect(m.id)} className="min-h-36 rounded-2xl border border-line bg-white p-6 text-left hover:border-brand">
            <NumBadge n={k + 1} />
            <h2 className="mt-3.5 mb-1.5 text-lg font-semibold">{m.title}</h2>
            <p className="text-sm leading-6 text-muted">{m.desc}</p>
          </button>
        ))}
      </div>
    </>
  )
}
