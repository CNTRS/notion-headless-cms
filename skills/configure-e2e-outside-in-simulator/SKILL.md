---
name: configure-e2e-outside-in-simulator
description: Arrancar un nuevo requerimiento escribiendo un test E2E que atraviesa la frontera del sistema (UI/HTTP) y falla, para guiar outside-in el diseño de la arquitectura desde el exterior hacia el interior.
---

## 1. Activación (Triggers)

* Nuevo requerimiento o historia de usuario que afecta a la interfaz del sistema (endpoint HTTP, comando CLI, evento de entrada).
* Ciclo de TDD outside-in: se empieza por el test de aceptación que describe el comportamiento esperado desde el exterior.
* Cambio en un flujo crítico que requiere validación de integración real (conectividad entre componentes).

## 2. Pasos de Implementación

1. **Identificar la frontera del sistema** — determinar por dónde entra el estímulo (petición HTTP, evento, clic de usuario).
2. **Escribir el test E2E que describe el journey completo** desde el estímulo hasta la respuesta esperada, usando únicamente los puertos externos (sin llamadas internas).
3. **Ejecutar el test** — verificar que falla por ausencia de implementación (no por error de infraestructura).
4. **Implementar la funcionalidad de dentro hacia afuera (outside-in):**
   - Crear la capa de entrada (controlador/handler) que recibe la petición.
   - Delegar en un caso de uso / servicio de aplicación (diseñar su interfaz primero).
   - Implementar la lógica de dominio necesaria.
   - Conectar las dependencias de infraestructura (persistencia, APIs externas).
5. **Pasar el test E2E** — verificar que el journey completo se cumple.

## 3. Verificación

- [ ] El test E2E es el primer commit del nuevo requerimiento (antes de cualquier implementación).
- [ ] El test se ejecuta en un entorno aislado (BD efímera, simuladores de terceros).
- [ ] El test cubre el journey completo sin acoplarse a detalles internos de implementación.
- [ ] El test se ejecuta en < 1 segundo por cada microservicio o en < 5 segundos para sistemas monolíticos.
- [ ] No hay lógica de dominio dentro de los tests E2E (sólo aserciones sobre la respuesta/salida).

## 4. Buenas Prácticas y Contraindicaciones

* ✅ Usar E2E como **guía de diseño**, no como herramienta de cobertura exhaustiva.
* ✅ Mantener una **pirámide de tests** saludable: muchos unitarios, pocos E2E.
* ✅ Usar `testcontainers` o bases de datos en memoria para el entorno aislado.
* ❌ **No** depender de entornos compartidos (staging compartido, BDs reales) — los tests E2E deben ser autocontenidos.
* ❌ **No** escribir E2E para lógica que pueda cubrirse con tests unitarios o de integración.
* ❌ **No** usar E2E como único tipo de test — sin tests unitarios la pirámide se invierte.

## 5. Skills Relacionadas

* `inject-test-doubles` — para aislar dependencias externas en capas inferiores
* `inject-dependencies-via-constructor` — necesario para desacoplar las capas
* `regroup-test-suites-by-context` — para organizar tests E2E por contexto de usuario
* `extract-fixtures-to-builder-pattern` — para construir datos de prueba complejos en el arrange del E2E
