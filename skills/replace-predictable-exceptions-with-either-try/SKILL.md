---
name: replace-predictable-exceptions-with-either-try
description: Modelar errores de negocio predecibles (saldo insuficiente, usuario no encontrado, formato inválido) mediante tipos algebraicos como Either/Try en lugar de excepciones, haciendo explícita en la firma del método la posibilidad de fallo.
---

## 1. Activación (Triggers)

* Bloques `try-catch` que capturan una excepción para redirigir el flujo normal del programa (control de flujo mediante excepciones).
* Métodos de dominio que lanzan excepciones esperadas y manejables por el negocio (`SaldoInsuficienteException`, `UsuarioNoEncontradoException`, `EmailInvalidoException`).
* Firmas de método que declaran `throws BusinessException` donde el caller siempre captura y maneja la excepción.
* Excepciones que forman parte del contrato del método — el caller no puede ignorarlas y siempre debe decidir cómo manejarlas.
* Lanzamiento de excepciones dentro de Value Objects o entidades para indicar datos inválidos.

## 2. Pasos de Implementación

1. **Identificar excepciones de negocio reemplazables** — distinguir entre:
   - **Errores de negocio predecibles** → reemplazar con `Either` (o `Try`, `Result`).
   - **Fallos de infraestructura catastróficos** (BD caída, timeout de red) → mantener como excepción.
2. **Crear tipos de error** para cada escenario: `sealed interface ErrorSaldo { case Insuficiente; case Negativo }` (o enum, o clases).
3. **Cambiar la firma del método**: de `T metodo()` throws `Ex` a `Either<Error, T> metodo()`.
4. **Reemplazar lanzamientos**:
   - `throw new SaldoInsuficienteException()` → `return Either.left(new ErrorSaldo.Insuficiente())`
   - Retornos exitosos → `return Either.right(valor)`
5. **Actualizar los callers** — el caller ahora debe hacer pattern matching o `fold/fold` para manejar ambos casos.
   - `resultado.fold(error -> ..., valor -> ...)` o `resultado.match(izquierda -> ..., derecha -> ...)`
6. **Eliminar la excepción** del sistema — si ya no se lanza, eliminar la clase y los bloques try-catch asociados.
7. **Verificar**: todos los tests pasan, las firmas son explícitas sobre el posible fallo.

## 3. Verificación

- [ ] Se ha eliminado la excepción de negocio del código (no se lanza en ningún punto).
- [ ] La firma del método explicita el fallo en el tipo de retorno: `Either<Error, T>`.
- [ ] El caller maneja ambos casos (éxito y error) de forma explícita — no hay `get()` ignorante.
- [ ] Excepciones de infraestructura (IO, red, BD) **no** se han reemplazado — siguen siendo excepciones.
- [ ] No se usa `Either` para errores que no son del dominio (mantener para errores de negocio únicamente).
- [ ] El código resultante es menos anidado que el `try-catch` original.

## 4. Buenas Prácticas y Contraindicaciones

* ✅ Usar `Either` para **errores que el caller puede y debe manejar** — son parte del contrato del método.
* ✅ Mantener las excepciones para **fallos de infraestructura que el caller no puede manejar** (BD caída, red).
* ✅ En lenguajes con pattern matching, `Either` + `sealed` classes mejora la exhaustividad del compilador.
* ❌ **No** reemplazar todas las excepciones por Either — solo errores de negocio predecibles y manejables.
* ❌ **No** usar `Either` para ocultar fallos de infraestructura — propagar la excepción real.
* ❌ **No** ignorar el lado `Left` — si el caller llama a `get()` directamente sobre el Either, se pierde el beneficio.

## 5. Skills Relacionadas

* `encapsulate-primitives-in-value-objects` — los Value Objects pueden devolver `Either<ErrorValidacion, VO>` en lugar de lanzar excepción
* `extract-guard-clauses-and-early-returns` — los Either se benefician de guard clauses tempranas que retornan `Left`
* `inject-dependencies-via-constructor` — las dependencias inyectadas permiten probar ambos lados del Either
* `inject-test-doubles` — los dobles pueden configurarse para retornar Either.left o Either.right según el escenario
