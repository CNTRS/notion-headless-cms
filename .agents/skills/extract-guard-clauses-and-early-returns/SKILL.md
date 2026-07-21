---
name: extract-guard-clauses-and-early-returns
description: Aplanar estructuras condicionales anidadas separando los casos límite o inválidos en guard clauses al inicio del método, reduciendo la carga cognitiva y dejando el flujo principal sin anidamiento.
---

## 1. Activación (Triggers)

* Sentencias `if-else` anidadas con profundidad > 1 nivel — especialmente dentro de bucles o bloques largos.
* Validaciones de parámetros o estado al inicio del método envuelven todo el cuerpo en un `if (válido) { ... }`.
* Métodos que mezclan validación de entrada con lógica de negocio, sin separación clara.
* Uso de `if-else` donde una de las ramas es un caso de error, límite o salida temprana.
* Fragmentos de código con alta complejidad ciclomática donde la indentación dificulta seguir el flujo.

## 2. Pasos de Implementación

1. **Identificar condiciones de guardia** — buscar condiciones que representen casos especiales, inválidos, límite o de salida:
   - Parámetros nulos o vacíos.
   - Estado del objeto que impide continuar.
   - Precondiciones de negocio no satisfechas.
   - Casos que deben abortar la operación inmediatamente.
2. **Invertir la condición si es necesario** — convertir `if (válido) { ... lógica principal }` en `if (!válido) return/null/throw; ... lógica principal`.
3. **Extraer la guard clause** al inicio del método — antes de cualquier mutación o lógica principal.
4. **Repetir** para cada condición de guardia adicional, en orden descendente de especificidad (más específico primero).
5. **Aplanar el flujo principal** — la lógica feliz queda sin anidamiento, en el nivel base del método.
6. **Verificar**: el mismo conjunto de tests pasa y la indentación de la lógica principal se ha reducido al menos un nivel.

## 3. Verificación

- [ ] Todas las guard clauses están al **inicio del método**, antes de cualquier mutación del estado.
- [ ] La lógica principal (happy path) tiene **indentación 0** dentro del método.
- [ ] Cada guard clause representa un caso **límite, inválido o de salida temprana**, no una rama de negocio válida.
- [ ] El método no ha perdido semántica — una guard clause con `return` es tan expresiva como el `if` anidado original.
- [ ] No se han eliminado `else` que representan ramas de negocio mutuamente excluyentes y válidas.

## 4. Buenas Prácticas y Contraindicaciones

* ✅ Las guard clauses deben ser **cortas** (1-3 líneas) y autodescriptivas.
* ✅ Ordenar guard clauses de más específica a más general (fail fast).
* ✅ Usar nombres de métodos auxiliares si la condición de guardia es compleja: `if (esInvalido(usuario)) return`.
* ❌ **No** usar guard clauses para eliminar ramas `else` que representan **reglas de negocio alternativas válidas** (ej: descuento para VIP vs normal).
* ❌ **No** ocultar la lógica principal — si el método tiene demasiadas guard clauses (> 5), considerar dividir el método.
* ❌ **No** poner guard clauses que mutan estado — las guard clauses deben abortar o salir, no preparar.

## 5. Skills Relacionadas

* `encapsulate-primitives-in-value-objects` — las validaciones de Value Objects usan guard clauses internamente
* `bifurcate-methods-via-cqs` — los comandos se benefician especialmente de guard clauses
* `mutate-code-via-tpp` — la extracción de guard clauses es una transformación TPP de tipo condicional
* `replace-predictable-exceptions-with-either-try` — las guard clauses pueden retornar un `Left` en lugar de lanzar excepción
