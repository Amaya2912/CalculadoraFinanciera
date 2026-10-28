export default function PageHeader({ title, subtitle }) {
  return (
    <header className="mb-7">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-1.5 text-muted">{subtitle}</p>
    </header>
  )
}
