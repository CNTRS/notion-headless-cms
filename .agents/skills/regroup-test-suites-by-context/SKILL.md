---
name: regroup-test-suites-by-context
description: Organizar los tests en una jerarquía anidada de contextos (describe/context), agrupando configuraciones compartidas y eliminando setUp masivos que ocultan la intención de cada prueba.
---

## 1. Activación (Triggers)

* Archivos de test con un único `describe` o clase que contiene más de 15 casos de prueba heterogéneos.
* Bloques `setUp` o `beforeEach` con más de 10 líneas que mezclan configuraciones para distintos escenarios.
* Tests donde el nombre combina múltiples variaciones (ej: `"usuario administrador con permisos puede crear artículo pero no editarlo si está pendiente"`).
* Dificultad para localizar qué configuración aplica a qué test dentro del mismo archivo.
* Test file con más de 200 líneas que mezcla varios contextos de negocio en una sola suite.

## 2. Pasos de Implementación

1. **Identificar los contextos naturales** — agrupar tests que comparten el mismo arrange o precondiciones. Buscar patrones en los nombres de test y en los setUp.
2. **Extraer cada contexto en un bloque anidado** (`describe`, `context`, `nested class`) con su propio `beforeEach` específico.
3. **Elevar configuraciones compartidas** al nivel más alto del árbol de contextos:
   - Lo que aplica a **todos** los tests → `describe` raíz
   - Lo que aplica a **un subgrupo** → `describe` anidado
   - Lo que aplica a **un solo test** → dentro del test
4. **Renombrar cada bloque** con frases que describan el estado o precondición (ej: `"cuando el usuario está autenticado"`, `"con saldo insuficiente"`).
5. **Mover tests al contexto adecuado** y eliminar conditionales dentro del test que verifican el contexto (redundante con la jerarquía).
6. **Verificar que cada test cabe en 3-5 líneas** de lógica específica (sin contar el arrange compartido en el beforeEach).

## 3. Verificación

- [ ] Cada bloque describe/context tiene un nombre que describe una *situación* o *precondición*, no una *acción*
- [ ] No hay `if` ni lógica condicional dentro del bloque de test que dependa del contexto — eso debe ir en el nivel de jerarquía
- [ ] La jerarquía tiene máximo 3 niveles de profundidad (`describe > describe > test`)
- [ ] El setUp raíz solo contiene configuraciones que aplican a todos los tests sin excepción
- [ ] El número de líneas del archivo de test se ha reducido o está mejor organizado visualmente

## 4. Buenas Prácticas y Contraindicaciones

* ✅ Nombrar contextos con frases nominales que describan el **estado**: `"con usuario autenticado"`, `"para artículos visibles"`.
* ✅ Nombrar los tests con frases que describan el **resultado esperado**: `"debe crear el artículo"`, `"debe rechazar con 403"`.
* ✅ Usar la jerarquía para reemplazar condicionales dentro de los tests.
* ❌ **No** compartir estado mutable entre contextos hermanos — cada contexto debe poder ejecutarse independientemente.
* ❌ **No** usar variables estáticas compartidas — rompen el determinismo y el paralelismo.
* ❌ **No** crear más de 3 niveles de anidamiento — si se necesita más, el test file debe dividirse en varios archivos.

## 5. Skills Relacionadas

* `extract-fixtures-to-builder-pattern` — los builders complementan la organización por contexto eliminando setUp pesados
* `inject-test-doubles` — los dobles de prueba suelen configurarse en los beforeEach de cada contexto
* `extract-guard-clauses-and-early-returns` — principio similar de "separar casos" aplicado al código de producción
