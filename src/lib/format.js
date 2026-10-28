const fmt = (min, max) => new Intl.NumberFormat('es-CO', { minimumFractionDigits: min, maximumFractionDigits: max })

export const money = (v) => '$ ' + fmt(2, 2).format(v)
export const pct = (v) => fmt(2, 2).format(v) + ' %'
export const num = (v, d = 2) => fmt(0, d).format(v)

// Acepta "12.5" o "12,5". Un campo vacío es inválido (NaN).
export const parse = (s) => (String(s).trim() === '' ? NaN : Number(String(s).trim().replace(',', '.')))
