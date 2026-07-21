## 1. Instalar Biome y limpiar dependencias viejas

- [x] 1.1 Ejecutar `pnpm add -D @biomejs/biome` para agregar Biome como devDependency
- [x] 1.2 Eliminar 6 devDependencies: `pnpm remove eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier prettier`
- [x] 1.3 Eliminar bloque `prettier` de `package.json`
- [x] 1.4 Verificar con `pnpm ls` que solo quede `@biomejs/biome` como lint/format tool

## 2. Crear configuración de Biome

- [x] 2.1 Crear `biome.json` en la raíz con formatter: indentStyle space, indentWidth 4, lineEnding lf, arrowParentheses asNeeded, bracketSpacing true
- [x] 2.2 Configurar linter con recommended: true y suspicioso.noExplicitAny: off
- [x] 2.3 Deshabilitar correctness.noUnusedVariables (lo cubre tsc)
- [x] 2.4 Deshabilitar organizeImports (se deja para cambio separado)
- [x] 2.5 Configurar files.ignore: coverage, public, dist, pnpm-lock.yaml, node_modules
- [x] 2.6 Incluir schema $schema para autocompletado en IDE

## 3. Actualizar scripts de package.json

- [x] 3.1 Agregar script `"lint": "biome check src/"` (formato + lint en un solo comando)
- [x] 3.2 Agregar script `"format": "biome format --write src/"` (solo formato, para el comando --write de prettier)
- [x] 3.3 Agregar script `"check": "biome ci src/"` para CI (read-only, fail on error)

## 4. Eliminar archivos viejos de configuración

- [x] 4.1 Eliminar `.eslintrc.cjs`
- [x] 4.2 Eliminar `.eslintignore`

## 5. Aplicar Biome al código existente

- [x] 5.1 Ejecutar `pnpm lint` y revisar los warnings/errors nuevos que Biome introduzca sobre el código actual
- [x] 5.2 Corregir manualmente los issues reportados por Biome (si los hay)
- [x] 5.3 Ejecutar `pnpm format` para aplicar el formato de Biome
- [x] 5.4 Revisar el diff de formato generado por Biome (esperado: cambios mínimos o nulos si la configuración de Prettier se mapeó correctamente)

## 6. Actualizar documentación del proyecto

- [x] 6.1 Actualizar `AGENTS.md`: reemplazar `npx eslint src/` por `pnpm lint` y `npx prettier --check src/` por `pnpm format` (o `biome format --check`)
- [x] 6.2 Agregar aclaración en AGENTS.md de que lint y format están unificados en Biome
- [x] 6.3 (Opcional) Actualizar README.md si menciona ESLint o Prettier

## 7. Validar que todo funciona

- [x] 7.1 Ejecutar `pnpm build` y verificar que compila sin errores (tsc + vite)
- [x] 7.2 Ejecutar `pnpm test` y verificar que los tests existentes pasan
- [x] 7.3 Ejecutar `pnpm lint` y verificar que sale limpio (0 warnings, 0 errors)
- [x] 7.4 Confirmar que `pnpm install` funciona correctamente con un `rm -rf node_modules && pnpm install`
- [x] 7.5 Commit del cambio completo (o mantener staged para revisión)
