import { useState } from 'react'
import { MODULES } from './modules'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import ModuleView from './components/ModuleView'

export default function App() {
  const [id, setId] = useState(null)
  const mod = MODULES.find((m) => m.id === id)

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink md:flex-row">
      <Sidebar modules={MODULES} activeId={id} onSelect={setId} />
      <main className="w-full max-w-4xl flex-1 p-6 md:p-12">
        {mod ? <ModuleView key={mod.id} mod={mod} /> : <Home modules={MODULES} onSelect={setId} />}
      </main>
    </div>
  )
}
