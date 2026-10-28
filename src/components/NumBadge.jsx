export default function NumBadge({ n, active = false }) {
  return (
    <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${active ? 'bg-brand text-white' : 'bg-tint text-brand-dark'}`}>
      {n}
    </span>
  )
}
