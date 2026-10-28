import { useState } from 'react'
import { parse } from '../lib/format'
import PageHeader from './PageHeader'
import Chips from './Chips'
import Field from './Field'
import ResultCard from './ResultCard'

export default function ModuleView({ mod }) {
  const [sel, setSel] = useState(mod.selectors.map(() => 0))
  const [raw, setRaw] = useState({})
  const [out, setOut] = useState(null)
  const fields = mod.fields(sel)

  // Al cambiar un selector, los siguientes vuelven a su primera opción.
  const pick = (idx, k) => {
    setSel(sel.map((x, j) => (j === idx ? k : j > idx ? 0 : x)))
    setOut(null)
  }
  const edit = (id, val) => {
    setRaw({ ...raw, [id]: val })
    setOut(null)
  }

  const run = () => {
    try {
      const v = {}
      for (const f of fields) {
        const x = f.options ? Number(raw[f.id] ?? f.def) : parse(raw[f.id] ?? f.def)
        if (Number.isNaN(x)) throw new Error(`Revisa el campo «${f.label}»: ingresa un número válido.`)
        v[f.id] = x
      }
      setOut({ ok: mod.calc(sel, v) })
    } catch (e) {
      setOut({ error: e.message })
    }
  }

  return (
    <>
      <PageHeader title={mod.title} subtitle={mod.subtitle} />
      <div className="rounded-2xl border border-line bg-white p-6">
        {mod.selectors.map((s, idx) => (
          <Chips key={idx} label={s.label} options={typeof s.options === 'function' ? s.options(sel) : s.options} value={sel[idx]} onChange={(k) => pick(idx, k)} />
        ))}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {fields.map((f) => <Field key={f.id} field={f} value={raw[f.id] ?? f.def} onChange={(val) => edit(f.id, val)} />)}
        </div>
        <button onClick={run} className="mt-6 h-12 rounded-lg bg-brand px-8 font-semibold text-white hover:bg-brand-dark">
          Calcular
        </button>
      </div>
      {out && <ResultCard {...out} />}
    </>
  )
}
