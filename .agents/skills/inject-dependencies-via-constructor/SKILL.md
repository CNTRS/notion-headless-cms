---
name: inject-dependencies-via-constructor
description: Eliminar el acoplamiento directo a implementaciones concretas reemplazando la creación interna de dependencias (`new`, estáticos) por parámetros de constructor, aplicando el Dependency Inversion Principle (DIP).
---

## 1. Activación (Triggers)

* Uso de `new` en el cuerpo de un método de negocio para crear instancias de servicios, repositorios o infraestructura.
* Acceso a variables o métodos estáticos (`Singleton`, `Utils.metodo()`) dentro de la lógica de dominio.
* Instanciación de objetos dentro de constructores que no son simples asignaciones de datos (ej: `this.repo = new UserRepository()`).
* Dificultad para probar una clase porque no se pueden reemplazar sus dependencias por dobles de prueba.
* Clases con múltiples responsabilidades (SRP violado) — suele manifestarse como más de 3 dependencias.

## 2. Pasos de Implementación

1. **Identificar cada dependencia concreta** — buscar `new`, llamadas a estáticos, `ServiceLocator.get()`, o instanciación directa de clases de infraestructura.
2. **Extraer interfaz/contrato** para cada dependencia — la clase de alto nivel depende de la abstracción, no de la implementación concreta.
3. **Añadir parámetros al constructor** para cada abstracción identificada:
   - Guardar cada dependencia como campo `private final` / `readonly`.
   - El constructor recibe las dependencias ya creadas desde el exterior.
4. **Eliminar la creación interna** — reemplazar `new Repo()` por usar `this.repo` (inyectado).
5. **Actualizar el punto de composición** (composición root, DI container, tests) para crear e inyectar las dependencias.
6. **Verificar**: la clase ya no importa implementaciones concretas de infraestructura, solo interfaces/abstracciones.

## 3. Verificación

- [ ] La clase ya no contiene `new` de dependencias externas (solo de Value Objects o colecciones).
- [ ] La clase ya no accede a variables o métodos estáticos de infraestructura.
- [ ] Todas las dependencias se reciben por constructor y se almacenan como `private final`.
- [ ] La clase tiene máximo 3 dependencias en el constructor — más indica violación de SRP.
- [ ] Es posible probar la clase inyectando dobles de prueba sin modificar el código de producción.
- [ ] Los tests existentes pasan sin cambios (si se actualiza la composición root correctamente).

## 4. Buenas Prácticas y Contraindicaciones

* ✅ Usar **interfaces** (no clases concretas) como tipo de las dependencias.
* ✅ Preferir **constructor injection** frente a setter o field injection — hace explícitas las dependencias obligatorias.
* ✅ Mantener las dependencias como `private final` — no exponer setters ni getters para ellas.
* ❌ **No** inyectar más de 3 dependencias — si se necesitan más, la clase viola SRP y debe dividirse.
* ❌ **No** inyectar dependencias opcionales como parámetros de constructor — usar `Optional` o factory method para configuraciones por defecto.
* ❌ **No** inyectar Value Objects o datos primitivos — inyectar comportamientos (servicios, repositorios), no datos.

## 5. Skills Relacionadas

* `inject-test-doubles` — tras la inyección por constructor, se pueden inyectar dobles en tests
* `encapsulate-primitives-in-value-objects` — los parámetros del constructor se benefician de estar tipados con VO
* `bifurcate-methods-via-cqs` — clases con DI suelen segregar comandos y consultas naturalmente
* `extract-guard-clauses-and-early-returns` — los constructores validan dependencias con guard clauses (null checks)
