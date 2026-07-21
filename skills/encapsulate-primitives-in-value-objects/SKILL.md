---
name: encapsulate-primitives-in-value-objects
description: Reemplazar primitivas (String, int) que representan conceptos de dominio por objetos Value Object inmutables que encapsulan validación, formateo y reglas de negocio asociadas.
---

## 1. Activación (Triggers)

* Variables `String` o `int` que representan conceptos de dominio con nombre (`email`, `edad`, `DNI`, `importe`, `códigoPostal`).
* Validaciones duplicadas en múltiples puntos del código sobre un mismo tipo primitivo (ej: `if (email.contains("@") && email.length() > 5)` repetido en 5 lugares).
* Parámetros primitivos que viajan juntos por varios métodos (ej: `calcular(importe, moneda)` → candidatos a `Dinero`).
* Comentarios tipo `// formato YYYY-MM-DD` o `// sin IVA` junto a primitivas — señal de que la primitiva no expresa suficiente significado.
* Uso de `String` o `int` como identificadores de dominio donde el tipado fuerte evitaría confusiones (ej: mezclar `UserId` y `OrderId` como `String`).

## 2. Pasos de Implementación

1. **Identificar el concepto de dominio** — buscar primitivas que aparecen juntas, tienen validaciones repetidas, o representan una idea de negocio.
2. **Crear la clase Value Object** inmutable:
   - Atributo `private final` (o `readonly`) del tipo primitivo (o compuesto).
   - Constructor que valida invariantes y lanza excepción (o devuelve `Either`) si los datos son inválidos.
   - Métodos `equals()` y `hashCode()` basados en el valor, no en la identidad del objeto.
   - No hay setters — todo se pasa en el constructor.
3. **Extraer la lógica dispersa**: mover todas las validaciones, formateos y transformaciones asociadas al Value Object.
4. **Agregar métodos de dominio** útiles (ej: `Email.dominio()`, `DNI.valido()`, `Dinero.sumar(Dinero otro)`).
5. **Reemplazar en toda la base de código**: cambiar parámetros y atributos primitivos por el nuevo Value Object.
6. **Compilar y pasar tests** — el compilador ahora impide mezclar tipos que antes eran ambos `String`.

## 3. Verificación

- [ ] La clase es inmutable: todos los campos son `final/readonly`, no hay setters.
- [ ] `equals` y `hashCode` están implementados por valor (no por referencia de memoria).
- [ ] El constructor valida las invariantes y rechaza estados inválidos al crearse (fail fast).
- [ ] No hay lógica de validación duplicada fuera del Value Object — toda está encapsulada.
- [ ] El Value Object expone métodos de dominio que operan sobre su valor (no getters genéricos).
- [ ] El compilador impide mezclar accidentalmente tipos diferentes (ej: pasar `Email` donde se espera `DNI`).

## 4. Buenas Prácticas y Contraindicaciones

* ✅ Un Value Object debe ser **conceptualmente inmutable** — cualquier "cambio" produce una nueva instancia.
* ✅ Usar **factory methods** (ver `convert-constructors-to-static-factories`) para crear Value Objects con validación.
* ✅ Implementar `toString()` para debugging, y métodos de conversión a primitiva si es necesario.
* ❌ **No** crear un Value Object para cada primitiva — solo para conceptos de dominio con invariantes o comportamiento.
* ❌ **No** añadir dependencias de infraestructura (JPA, serialización JSON) dentro del Value Object — contamina el dominio.
* ❌ **No** permitir `null` en los Value Objects — usar `Optional<VOHolder>` si es opcional.

## 5. Skills Relacionadas

* `convert-constructors-to-static-factories` — los factory methods mejoran la creación de Value Objects con nombres semánticos
* `extract-guard-clauses-and-early-returns` — las validaciones del constructor del Value Object usan guard clauses
* `replace-predictable-exceptions-with-either-try` — los Value Objects pueden devolver el resultado de validación como Either<Error, VO>
* `bifurcate-methods-via-cqs` — las consultas en Value Objects son puras y sin efectos secundarios (CQS-friendly)
