---
name: inject-test-doubles
description: Aislar la unidad de prueba reemplazando sus colaboradores externos (bases de datos, APIs, sistema de archivos) por dobles controlados, garantizando tests deterministas, rápidos y fiables.
---

## 1. Activación (Triggers)

* Tests que llaman a APIs reales, bases de datos, o sistemas de archivos — provocando lentitud (> 100ms/test) o fallos no deterministas.
* Tests que requieren configuración compleja de infraestructura (contenedores Docker, credenciales, redes) para probar lógica simple.
* La unidad a probar depende de interfaces externas o inestables que convierten el test en una prueba de integración no deseada.
* Dificultad para reproducir escenarios de error o casos límite porque la dependencia real no permite inyectar fallos.

## 2. Pasos de Implementación

1. **Verificar que la dependencia se inyecta por constructor** — si no es así, aplicar primero `inject-dependencies-via-constructor`.
2. **Elegir el tipo de doble adecuado**:
   - **Stub** — proporciona respuestas prefijadas. Usar cuando solo interesa el valor de retorno.
   - **Spy** — registra las interacciones para verificarlas después. Usar cuando interesa qué se llamó.
   - **Mock** — verifica expectativas de interacción en el momento. Usar cuando el número/orden de llamadas es parte del contrato.
   - **Fake** — implementación ligera y funcional (ej: repositorio en memoria). Usar cuando se necesita comportamiento real sin infraestructura.
3. **Crear o instanciar el doble** usando la librería (Mockito, Sinon, unittest.mock) o implementando manualmente la interfaz (preferible para fakes).
4. **Configurar el comportamiento esperado** (returns, throws) en el doble.
5. **Inyectar el doble en el SUT** a través del constructor.
6. **Ejecutar la lógica a probar y verificar** aserciones sobre la salida y/o interacciones registradas.

## 3. Verificación

- [ ] El test sin el doble era lento (> 100ms) o no determinista; con el doble es rápido (< 10ms) y determinista.
- [ ] El doble se inyecta por constructor, no se crea dentro del SUT ni se pasa por setter después de construir.
- [ ] No hay uso de `verify` sobre stubs ni configuración de retornos sobre mocks estrictos (usar cada doble para su propósito).
- [ ] El test cubre escenarios de error que serían difíciles de reproducir con la dependencia real.
- [ ] Los mocks no devuelven otros mocks — eso indica acoplamiento excesivo a la implementación interna.

## 4. Buenas Prácticas y Contraindicaciones

* ✅ **Preferir fakes y stubs sobre mocks** — son menos frágiles y más fáciles de mantener.
* ✅ Mantener **un solo mock por test** — múltiples mocks indican que el test cubre demasiadas responsabilidades.
* ✅ Envuelve librerías de terceros en una interfaz propia antes de simularlas.
* ❌ **No** simular clases concretas que no se controlan — envolver en una abstracción primero.
* ❌ **No** usar `verify` para interacciones triviales (getters, llamadas obvias) — solo para interacciones contractuales.
* ❌ **No** crear dobles de Value Objects o entidades de dominio — son datos, no colaboradores.

## 5. Skills Relacionadas

* `inject-dependencies-via-constructor` — prerrequisito: sin DI no se pueden inyectar dobles
* `extract-fixtures-to-builder-pattern` — los builders facilitan la creación del SUT con sus dobles
* `configure-e2e-outside-in-simulator` — los E2E usan dobles a nivel de sistema (simuladores de terceros)
* `replace-predictable-exceptions-with-either-try` — los dobles permiten simular errores de negocio y verificar que se manejan con Either/Try
