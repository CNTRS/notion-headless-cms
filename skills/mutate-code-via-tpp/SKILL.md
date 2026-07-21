---
name: mutate-code-via-tpp
description: Guiar el ciclo TDD aplicando la Transformation Priority Premise (TPP) de Robert C. Martin para avanzar desde código hardcodeado a código generalizado mediante la transformación más simple posible en cada paso.
---

## 1. Activación (Triggers)

* El test pasa a verde con una implementación "trampa" (retorno hardcodeado, constante literal) y el siguiente test fuerza una generalización
* Se necesita decidir qué transformación aplicar entre varias posibles para pasar el siguiente test
* Triangulación en TDD: se tiene un segundo ejemplo que obliga a refactorizar la primera implementación ingenua
* Estado: test rojo → test verde (con código hardcodeado) → refactor necesario para el siguiente test

## 2. Pasos de Implementación

1. **Tener el test en verde** (fase verde del ciclo TDD) aunque sea con código hardcodeado.
2. **Escribir el siguiente test** que fuerza una generalización (nuevo ejemplo, nuevo caso límite).
3. **Ejecutar el test** — debe fallar (rojo).
4. **Aplicar la TPP** para elegir la transformación más simple que haga pasar el test:
   - Consultar la lista priorizada de transformaciones (ver referencias).
   - Preferir la transformación de menor prioridad (más simple) que resuelva el nuevo test.
   - No saltar a bucles, recursión o polimorfismo si una transformación más simple (de constante a variable, de condicional a loop, etc.) funciona.
5. **Ejecutar todos los tests** — deben pasar (verde).
6. **Refactorizar** si el código resultante tiene duplicación o mala expresividad (manteniendo verde).

## 3. Escala TPP (de más simple a más compleja)

| Prioridad | Transformación | Ejemplo |
|:---|:---|:---|
| 1 | `{} → nil` (sin implementación) | Test en rojo inicial |
| 2 | `nil → constante` | `return 42` |
| 3 | `constante → constante+` | Añadir una constante más |
| 4 | `constante → variable` | `return n` |
| 5 | `variable → array` | Agregar colección |
| 6 | `variable → condicional` | `if (x) { a } else { b }` |
| 7 | `condicional → bucle` | `for/while` sobre colección |
| 8 | `condicional → recursión` | Llamada recursiva |
| 9 | `expresión → función` | Extraer método |
| 10 | `variable → polimorfismo` | Strategy, Template Method |

## 4. Verificación

- [ ] Cada nueva transformación es la más simple posible según la escala TPP
- [ ] No se han introducido bucles cuando bastaba un condicional
- [ ] No se han introducido abstracciones (interfaces, polimorfismo) cuando bastaba una variable o un condicional
- [ ] El test rojo se ha puesto en verde con un mínimo de 1-3 líneas de código nuevo
- [ ] Todos los tests pasan después de cada transformación

## 5. Buenas Prácticas y Contraindicaciones

* ✅ Avanzar en **pequeños pasos**: cada transformación debe resolver exactamente un nuevo test.
* ✅ Si la transformación más simple no funciona, probar la siguiente en la escala antes de saltar a una compleja.
* ✅ Revertir si una transformación introduce complejidad prematura — elegir una casuística más simple para el siguiente test.
* ❌ **No** implementar bucles ni recursión si un condicional puede resolver el nuevo test.
* ❌ **No** saltar directamente a polimorfismo — agotar primero las transformaciones de menor prioridad.
* ❌ **No** aplicar TPP mecánicamente si la experiencia sugiere que una transformación superior es más natural para el dominio.

## 6. Skills Relacionadas

* `generate-property-based-tests` — los property-based tests proporcionan múltiples ejemplos que guían la generalización
* `extract-guard-clauses-and-early-returns` — los guard clauses son un tipo de transformación condicional
* `bifurcate-methods-via-cqs` — CQS ayuda a identificar qué transformaciones aplicar en consultas vs comandos
