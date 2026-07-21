---
name: convert-constructors-to-static-factories
description: Reemplazar constructores sobrecargados con métodos fábrica estáticos con nombre semántico, mejorando la expresividad de la creación de objetos y ocultando la lógica de validación.
---

## 1. Activación (Triggers)

* Clase con múltiples constructores sobrecargados con diferentes combinaciones de parámetros.
* Constructor con lógica compleja de validación, normalización o transformación de datos.
* Uso de `new` donde la intención no es obvia — el nombre del constructor (el de la clase) no describe la variante de creación.
* Creación de objetos donde algunas combinaciones de parámetros son inválidas y se documentan con comentarios o excepciones en el constructor.

## 2. Pasos de Implementación

1. **Identificar las variantes de creación** — listar todas las formas válidas de instanciar la clase y la intención de cada una.
2. **Elegir nombres semánticos** para cada variante usando el lenguaje ubicuo del dominio (ej: `Factura.crearDesdePedido()`, `Factura.recuperarHistórica()`, `Factura.enBlanco()`).
3. **Hacer privado el constructor** base (el que menos parámetros recibe o el que contiene la lógica compartida).
4. **Crear los métodos static** que llaman al constructor privado y aplican la lógica de validación/normalización antes de delegar.
5. **Reemplazar todas las llamadas externas** de `new Clase(args)` por `Clase.metodoCreador(args)`.
6. **Verificar**: los tests siguen pasando y no hay referencias directas al constructor desde fuera de la clase.

## 3. Verificación

- [ ] El constructor nativo es `private` (o protegido) — nadie externo puede llamar a `new` directamente.
- [ ] Cada método fábrica tiene un nombre que expresa la *intención* o el *origen* de la creación.
- [ ] La lógica de validación que antes estaba en el constructor ahora está en los métodos fábrica.
- [ ] No hay duplicación de validación entre métodos fábrica (usar un constructor privado común o un método `validate` compartido).
- [ ] No hay efectos secundarios en el constructor privado — solo asignación de campos.

## 4. Buenas Prácticas y Contraindicaciones

* ✅ Usar nombres que reflejen el **contexto de creación**: `dePrima()`, `conDescuento()`, `porDefecto()`.
* ✅ Mantener el constructor privado simple — solo asigna parámetros a campos.
* ✅ Las validaciones complejas pertenecen a los métodos fábrica, no al constructor.
* ❌ **No** crear un método fábrica por cada combinación de parámetros — solo para variantes semánticas significativas.
* ❌ **No** usar métodos fábrica si la clase se instancia con un DI container que requiere constructor público.
* ❌ **No** añadir lógica de negocio en el factory que no esté directamente relacionada con la validación de creación.

## 5. Skills Relacionadas

* `encapsulate-primitives-in-value-objects` — los Value Objects como parámetros de los factories mejoran la seguridad en creación
* `extract-guard-clauses-and-early-returns` — los métodos fábrica se benefician de guard clauses para validar parámetros
* `inject-dependencies-via-constructor` — compatibilidad: los factories pueden usar DI o recibir dependencias como parámetros
