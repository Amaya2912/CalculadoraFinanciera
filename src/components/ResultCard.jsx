export default function ResultCard({ ok, error }) {
  if (error) {
    return <div role="alert" className="mt-4 rounded-2xl border border-red-300 bg-red-50 p-5 text-red-900">{error}</div>
  }
  return (
    <div aria-live="polite" className="mt-4 rounded-2xl bg-deep p-6 text-white">
      <div className="text-sm text-emerald-100">{ok.title}</div>
      <div className="my-2 break-words font-mono text-4xl font-medium">{ok.value}</div>
    </div>
  )
}
