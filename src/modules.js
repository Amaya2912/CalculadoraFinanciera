import { money, pct, num } from './lib/format'

// [nombre, periodos por año]
const UNIDADES = [['Años', 1], ['Semestres', 2], ['Cuatrimestres', 3], ['Trimestres', 4], ['Bimestres', 6], ['Meses', 12], ['Semanas', 52], ['Quincenas', 26], ['Días', 360]]
const PERIODICIDAD = [['Anual', 1], ['Semestral', 2], ['Cuatrimestral', 3], ['Trimestral', 4], ['Bimestral', 6], ['Mensual', 12], ['Quincenal', 26], ['Semanal', 52], ['Diaria', 360]]
const nombres = (lista) => lista.map((x) => x[0])

const check = (ok, msg) => { if (!ok) throw new Error(msg) }
const pos = (...xs) => xs.every((x) => x > 0)

// Campos reutilizables: un número (def) o un select (options, def = índice).
const campo = (id, label, def) => ({ id, label, def })
const F = {
  vp: campo('vp', 'Valor presente ($)', '2000000'),
  vf: campo('vf', 'Valor futuro ($)', '2536483.59'),
  R: campo('R', 'Cuota ($)', '500000'),
  val: campo('val', 'Valor conocido ($)', '10000000'),
  tasa: campo('tasa', 'Tasa de interés (%)', '1,5'),
  tasaPer: campo('tasa', 'Tasa por período (%)', '2'),
  n: campo('n', 'Número de períodos', '12'),
  per: { id: 'per', label: 'Periodicidad', options: nombres(PERIODICIDAD), def: '5' },
  base: { id: 'base', label: 'Valor conocido', options: ['Valor presente', 'Valor futuro'], def: '0' },
}

// [opción, título del resultado, fórmula (en decimales), texto de la fórmula]
const CONVERSIONES = [
  ['Nominal a periódico', 'Tasa periódica', (i, m) => i / m, 'i / m'],
  ['Periódico a nominal', 'Tasa nominal', (i, m) => i * m, 'i · m'],
  ['Nominal a efectivo', 'Tasa efectiva anual', (i, m) => (1 + i / m) ** m - 1, '(1 + i/m)^m − 1'],
  ['Efectivo a nominal', 'Tasa nominal anual', (i, m) => ((1 + i) ** (1 / m) - 1) * m, 'm · [(1 + i)^(1/m) − 1]'],
  ['Efectivo a periódico', 'Tasa periódica', (i, m) => (1 + i) ** (1 / m) - 1, '(1 + i)^(1/m) − 1'],
  ['Periódico a efectivo', 'Tasa efectiva', (i, m) => (1 + i) ** m - 1, '(1 + i)^m − 1'],
  ['Vencido a anticipado', 'Tasa anticipada', (i) => i / (1 + i), 'i / (1 + i)'],
  ['Anticipado a vencido', 'Tasa vencida', (i) => i / (1 - i), 'i / (1 − i)'],
]

// Cada módulo: selectors (chips), fields(sel) → campos a pedir, calc(sel, v) → { title, value, formula }
export const MODULES = [
  {
    id: 'temporalidad',
    title: 'Conversión de temporalidad',
    subtitle: 'Convierte una cantidad de tiempo entre unidades.',
    desc: 'Años, semestres, meses, días y más.',
    selectors: [],
    fields: () => [
      campo('q', 'Cantidad de tiempo', '18'),
      { id: 'o', label: 'Unidad de origen', options: nombres(UNIDADES), def: '5' },
      { id: 'd', label: 'Unidad de destino', options: nombres(UNIDADES), def: '1' },
    ],
    calc: (_, v) => {
      check(v.q >= 0, 'La cantidad de tiempo no puede ser negativa.')
      const [no, po] = UNIDADES[v.o]
      const [nd, pd] = UNIDADES[v.d]
      return { title: 'Resultado', value: `${num(v.q)} ${no.toLowerCase()} = ${num((v.q / po) * pd, 4)} ${nd.toLowerCase()}`, formula: `${num(v.q)} ÷ ${po} × ${pd}` }
    },
  },
  {
    id: 'tasas',
    title: 'Conversión de tasas de interés',
    subtitle: 'Elige el tipo de conversión e ingresa los datos.',
    desc: 'Nominal, efectiva, periódica, vencida y anticipada.',
    selectors: [{ label: 'Tipo de conversión', options: CONVERSIONES.map((c) => c[0]) }],
    fields: ([k]) => (k < 6 ? [F.tasa, F.per] : [F.tasa]),
    calc: ([k], v) => {
      check(v.tasa >= 0, 'La tasa de interés no puede ser negativa.')
      const [, titulo, f, formula] = CONVERSIONES[k]
      const i = v.tasa / 100
      if (k === 7) check(i < 1, 'La tasa anticipada debe ser menor al 100 %.')
      return { title: titulo, value: pct(f(i, k < 6 ? PERIODICIDAD[v.per][1] : 1) * 100), formula }
    },
  },
  {
    id: 'indexar',
    title: 'Indexación de intereses',
    subtitle: 'Combina una tasa base con un margen.',
    desc: 'IPC, UVR, DTF e IBR con su margen.',
    selectors: [{ label: 'Tipo de indexación', options: ['IPC', 'UVR', 'DTF', 'IBR'] }],
    fields: () => [campo('base', 'Tasa base (%)', '5,2'), campo('margen', 'Margen (%)', '3')],
    calc: ([k], v) => {
      const compuesta = k < 2 // IPC y UVR se componen; DTF e IBR se suman
      const r = compuesta ? ((1 + v.base / 100) * (1 + v.margen / 100) - 1) * 100 : v.base + v.margen
      return { title: `Tasa indexada al ${['IPC', 'UVR', 'DTF', 'IBR'][k]}`, value: pct(r), formula: compuesta ? '(1 + base) · (1 + margen) − 1' : 'base + margen' }
    },
  },
  {
    id: 'compuesto',
    title: 'Interés compuesto',
    subtitle: 'Elige qué variable quieres calcular.',
    desc: 'Valor presente, valor futuro, tiempo y tasa.',
    selectors: [{ label: '¿Qué desea calcular?', options: ['Valor presente', 'Valor futuro', 'Tiempo', 'Tasa de interés'] }],
    fields: ([k]) => [[F.vf, F.tasaPer, F.n], [F.vp, F.tasaPer, F.n], [F.vp, F.vf, F.tasaPer], [F.vp, F.vf, F.n]][k],
    calc: ([k], v) => {
      const i = v.tasa / 100
      if (k === 0) { check(pos(v.vf, v.n) && i > -1, 'Los datos ingresados no son válidos.'); return { title: 'Valor presente', value: money(v.vf / (1 + i) ** v.n), formula: 'VF / (1 + i)^n' } }
      if (k === 1) { check(pos(v.vp, v.n) && i > -1, 'Los datos ingresados no son válidos.'); return { title: 'Valor futuro', value: money(v.vp * (1 + i) ** v.n), formula: 'VP · (1 + i)^n' } }
      if (k === 2) {
        check(pos(v.vp, v.vf) && i > -1 && i !== 0, 'Los datos ingresados no son válidos.')
        const n = Math.log(v.vf / v.vp) / Math.log(1 + i)
        check(n >= 0, 'El tiempo calculado es negativo.')
        return { title: 'Tiempo', value: `${num(n)} períodos`, formula: 'ln(VF / VP) / ln(1 + i)' }
      }
      check(pos(v.vp, v.vf, v.n), 'Los datos ingresados no son válidos.')
      return { title: 'Tasa de interés por período', value: pct(((v.vf / v.vp) ** (1 / v.n) - 1) * 100), formula: '(VF / VP)^(1/n) − 1' }
    },
  },
  {
    id: 'anualidades',
    title: 'Anualidades',
    subtitle: 'Define el tipo de anualidad y qué quieres calcular.',
    desc: 'Vencidas, anticipadas y perpetuidades.',
    selectors: [
      { label: 'Tipo de anualidad', options: ['Vencida', 'Anticipada', 'Perpetuidad vencida'] },
      { label: '¿Qué desea calcular?', options: ([t]) => (t === 2 ? ['Valor presente', 'Cuota'] : ['Valor presente', 'Valor futuro', 'Cuota', 'Tiempo']) },
    ],
    fields: ([t, c]) => {
      if (t === 2) return c === 0 ? [F.R, F.tasa] : [F.vp, F.tasa]
      return [[F.R, F.tasa, F.n], [F.R, F.tasa, F.n], [F.base, F.val, F.tasa, F.n], [F.base, F.val, F.R, F.tasa]][c]
    },
    calc: ([t, c], v) => {
      const i = v.tasa / 100
      check(i > 0, 'La tasa debe ser mayor que cero.')
      if (t === 2) {
        check(pos(c === 0 ? v.R : v.vp), 'El valor ingresado debe ser mayor que cero.')
        return c === 0 ? { title: 'Valor presente', value: money(v.R / i), formula: 'R / i' } : { title: 'Cuota periódica', value: money(v.vp * i), formula: 'VP · i' }
      }
      const a = t === 1 ? 1 + i : 1 // las anticipadas multiplican (o dividen) por (1 + i)
      const g = (1 + v.n) ** 0 * (1 + i) ** v.n
      const sufijo = t === 1 ? ' · (1 + i)' : ''
      const err = 'Los datos deben ser mayores que cero.'
      if (c === 0) { check(pos(v.R, v.n), err); return { title: 'Valor presente', value: money(v.R * ((g - 1) / (i * g)) * a), formula: 'R · [(1+i)^n − 1] / [i · (1+i)^n]' + sufijo } }
      if (c === 1) { check(pos(v.R, v.n), err); return { title: 'Valor futuro', value: money(v.R * ((g - 1) / i) * a), formula: 'R · [(1+i)^n − 1] / i' + sufijo } }
      if (c === 2) {
        check(pos(v.val, v.n), err)
        const R = v.base === 0 ? (v.val * i * g) / (g - 1) / a : (v.val * i) / (g - 1) / a
        return { title: 'Cuota periódica', value: money(R), formula: v.base === 0 ? 'VP · i · (1+i)^n / [(1+i)^n − 1]' : 'VF · i / [(1+i)^n − 1]' }
      }
      check(pos(v.val, v.R), err)
      const x = (v.val * i) / (v.R * a)
      const arg = v.base === 0 ? 1 - x : 1 + x
      check(v.base === 0 ? arg > 0 && arg < 1 : arg > 0, 'No existe un tiempo válido con esos datos.')
      const n = (v.base === 0 ? -1 : 1) * (Math.log(arg) / Math.log(1 + i))
      return { title: 'Tiempo', value: `${num(n)} períodos`, formula: 'ln(1 ± VP·i / R) / ln(1 + i)' }
    },
  },
]
