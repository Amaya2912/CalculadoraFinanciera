import NumBadge from './NumBadge'

export default function Sidebar({ modules, activeId, onSelect }) {
  return (
    <aside className="shrink-0 border-b border-line bg-white p-4 md:w-64 md:border-r md:border-b-0 md:pt-7">
      <button onClick={() => onSelect(null)} className="px-3 pb-6 text-left text-lg font-semibold">
        Ingeniería Económica
      </button>
      <nav className="flex gap-1 overflow-x-auto md:flex-col">
        {modules.map((m, k) => {
          const active = m.id === activeId
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-left text-[15px] ${active ? 'bg-tint font-semibold text-brand-dark' : 'text-muted hover:bg-canvas'}`}
            >
              <NumBadge n={k + 1} active={active} />
              {m.title}
            </button>
          )
        })}
      </nav>
      <p className="mt-8 hidden px-3 text-xs leading-6 text-muted md:block">
        Jesús D. Santodomingo C.<br />Jhon A. Amaya L.<br />Camila Gomez
      </p>
    </aside>
  )
}
