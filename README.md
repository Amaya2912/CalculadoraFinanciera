# Calculadora de Ingeniería Económica

React + Vite + TailwindCSS v4.

    npm install
    npm run dev

## Estructura

- `src/modules.js`: los 5 módulos descritos como datos (selectores, campos y fórmulas). Para agregar un cálculo nuevo solo se edita este archivo.
- `src/components/`: componentes reutilizables (`Sidebar`, `Home`, `ModuleView`, `Chips`, `Field`, `ResultCard`, `PageHeader`, `NumBadge`).
- `src/lib/format.js`: formato de moneda, porcentaje y lectura de números.

En los campos numéricos usa punto o coma como separador decimal y no escribas separador de miles.
