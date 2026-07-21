## Context

El proyecto usa ESLint v8 + `@typescript-eslint` v6 para linting y Prettier v3 para formato, configurados via `.eslintrc.cjs` + bloque inline en `package.json`. Son 6 devDependencies que Biome reemplaza con una sola.

Es un proyecto TypeScript pequeño (7 archivos fuente en `src/`, 1 en `examples/`, 1 root config). El type-checking lo hace `tsc` (vía `pnpm build`). No hay JSX/TSX.

## Goals / Non-Goals

**Goals:**
- Migrar lint + format a Biome sin perder el estilo actual del código
- Preservar la regla `no-explicit-any: off`
- Matching de Prettier: 4 espacios, arrow parens avoid, lf, bracket spacing
- Actualizar comandos y documentación del proyecto

**Non-Goals:**
- No se introducen nuevas reglas de lint (solo las que vienen por defecto con `recommended: true`)
- No se cambia el pipeline de build
- No se modifica la lógica funcional del CMS

## Decisions

### D1: Configurar Biome via `biome.json` (no `package.json`)

- **Opción A (elegida)**: `biome.json` en la raíz. Es el estándar de Biome, autodetectado, permite schema validation, y separa tooling config del package metadata.
- **Opción B**: `package.json` bajo clave `"biome"`. Soportado pero no recomendado porque mezcla responsabilidades.

### D2: Usar `recommended: true` con ajustes mínimos

- **Elegido**: Activar `linter.rules.recommended: true` + apagar solo `suspicious.noExplicitAny` (para mantener paridad con la regla actual `@typescript-eslint/no-explicit-any: off`). El set `recommended` de Biome cubre más bugs que ESLint recommended, pero también puede introducir nuevos warnings. Se corrigen en el mismo cambio.
- Alternativa descartada: Hacer un audit rule-by-rule. Es trabajo extra innecesario para un proyecto de este tamaño.

### D3: No activar `organizeImports`

- **Elegido**: Inicialmente mantener `organizeImports.enabled: false`. La exploración mostró que Biome reordena imports de forma distinta al orden manual actual. Mejor aplicar `organizeImports` como un cambio separado si se desea, para mantener el diff limpio y revisable (ver riesgo R1).
- Alternativa: Activarlo junto con el resto. Descartado para evitar un diff +200 líneas de reordenamientos cosméticos.

### D4: `noUnusedVariables` apagado en Biome (lo cubre TypeScript)

- **Elegido**: Apagar `correctness.noUnusedVariables` en Biome porque `tsconfig.json` ya tiene `noUnusedLocals: true` y `noUnusedParameters: true`. Activarlo en Biome sería redundante y podría causar conflictos si Biome y `tsc` tienen interpretaciones distintas del mismo código.

### D5: Scope de `biome check`

- **Elegido**: Incluir solo `src/` y los archivos de config raíz (`vite.config.ts`, `biome.json`). Excluir `examples/` (no se verifica actualmente) y por supuesto `dist/`, `node_modules/`, `coverage/`, `pnpm-lock.yaml`.

### D6: Comando `format` vs `check`

- **Elegido**: `biome check --write` reemplaza a `eslint --fix` + `prettier --write` combinados. `biome ci` se usa para CI (no permite writes, fail on error). Se definen ambos scripts en `package.json`.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| **R1**: `organizeImports` reordena imports y ensucia el diff | Se deja desactivado. Se evaluará en cambio separado. |
| **R2**: Biome `recommended` introduce warnings nuevos no cubiertos antes | Se ejecuta `biome check src/` y se corrigen manualmente los issues nuevos antes de commit. |
| **R3**: Diferencias de formato entre Prettier y Biome en edge cases | Se ejecuta `biome format --write src/` y se revisa el diff visualmente. Para este proyecto (~800 líneas) es trivial verificar. |
| **R4**: Regresión silenciosa (lint no captura algo que ESLint capturaba) | Las ~12 reglas perdidas son de baja incidencia para TS moderno. El type-checker `tsc` ya cubre varios de esos casos. Aceptamos el riesgo. |
