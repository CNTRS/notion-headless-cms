## Why

ESLint + Prettier requieren 6 dependencias separadas con config duplicada (`.eslintrc.cjs` + bloque inline en `package.json`). Biome unifica lint y formato en una sola herramienta ~10-20x más rápida, con una única fuente de verdad de configuración. Migrar ahora que el proyecto es pequeño minimiza el riesgo de diff y el costo de transición.

## What Changes

- Reemplazar ESLint v8 + Prettier v3 por Biome
- Eliminar `.eslintrc.cjs`, `.eslintignore`
- Eliminar bloque `prettier` de `package.json`
- Eliminar 6 devDeps: `eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-config-prettier`, `eslint-plugin-prettier`, `prettier`
- Agregar `@biomejs/biome` como devDep
- Crear `biome.json` con config que preserve el estilo actual (4 espacios, arrow parens avoid, lf, etc.)
- Actualizar scripts en `package.json` (lint, format)
- Actualizar comandos en `AGENTS.md`
- Migrar regla `no-explicit-any: off` a Biome
- Ejecutar `biome check --write` para aplicar formato y ajustar cualquier diff

## Capabilities

### New Capabilities
<!-- No hay nuevas capabilities funcionales. Es un cambio de tooling interno. -->
*(ninguna — el cambio no introduce nuevas funcionalidades al CMS)*

### Modified Capabilities
<!-- No hay cambios en requirements a nivel spec. -->
*(ninguna)*

## Impact

- Dependencias: 6 devDeps → 1 (`@biomejs/biome`)
- Archivos eliminados: `.eslintrc.cjs`, `.eslintignore`
- Archivos nuevos: `biome.json`
- Archivos modificados: `package.json`, `AGENTS.md` (comandos lint/format)
- ~12 reglas de ESLint de baja incidencia no tienen equivalente directo en Biome; ninguna afecta al proyecto actual
- Organización de imports (antes no controlada): Biome la aplicará automáticamente — revisar diff
