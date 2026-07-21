---
name: generate-property-based-tests
description: Validar invariantes del sistema generando cientos de casos de prueba aleatorios, descubriendo comportamientos inesperados que los tests basados en ejemplos fijos no cubren.
---

## 1. Activación (Triggers)

* Funciones o métodos con propiedades formales identificables: conmutatividad, reversibilidad, idempotencia, inyectividad.
* Algoritmos de transformación de datos (parseo, serialización, ordenación, búsqueda, cálculos matemáticos).
* Validación de invariantes de dominio: "el email debe contener @", "el importe debe ser positivo".
* Tests existentes basados en ejemplos concretos donde se sospecha que hay casos no cubiertos.
* Refactorización de código con alta complejidad ciclomática que necesita verificación masiva de regresión.

## 2. Pasos de Implementación

1. **Identificar las propiedades/invariantes** del código a probar:
   - *Reversibilidad*: `decode(encode(x)) == x`
   - *Idempotencia*: `f(f(x)) == f(x)`
   - *Invariancia*: ante cualquier entrada, la salida cumple X
   - *Metamorfismo*: relación entre dos ejecuciones con entradas relacionadas
2. **Elegir un generador** apropiado para los datos de entrada (`arbitrary`, `gen`, etc.) restringido a valores válidos del dominio.
3. **Escribir el test**:
   - Importar la librería de property-based testing (jqwik, fast-check, Hypothesis, scalacheck).
   - Expresar la propiedad como una función que recibe datos generados y verifica el invariante.
   - Configurar número de iteraciones (100-1000 por defecto según librería).
4. **Ejecutar y analizar fallos**: si la propiedad falla, la librería encuentra el *shrunken counterexample* — el caso mínimo que reproduce el fallo.
5. **Convertir el contraejemplo en un test de ejemplo** fijo para asegurar la regresión.

## 3. Verificación

- [ ] La propiedad describe un invariante, no una secuencia de pasos procedural.
- [ ] El generador produce datos válidos para el dominio (no datos inválidos que la función debe rechazar con excepción).
- [ ] El fallo encontrado se ha reducido al caso mínimo (*shrinking* automático).
- [ ] Se ha añadido un test de ejemplo fijo con el contraejemplo mínimo.
- [ ] La batería completa se ejecuta en menos de 2 segundos.

## 4. Buenas Prácticas y Contraindicaciones

* ✅ Empezar con propiedades simples (reversibilidad, idempotencia) antes de propiedades complejas.
* ✅ Combinar con tests de ejemplo para cubrir casos límite conocidos.
* ✅ Usar el *shrinking* automático para diagnosticar fallos.
* ❌ **No** usar property-based tests para lógica con efectos secundarios (IO, mutación de estado global).
* ❌ **No** sustituir *todos* los tests de ejemplo por property-based — ambos son complementarios.
* ❌ **No** configurar demasiadas iteraciones (> 10000) sin necesidad — ralentiza la suite.

## 5. Skills Relacionadas

* `mutate-code-via-tpp` — los property-based tests guían la generalización del algoritmo
* `inject-test-doubles` — útil cuando el SUT depende de colaboradores que deben aislarse antes de la generación de datos
* `encapsulate-primitives-in-value-objects` — los Value Objects con validación propia son ideales para tests basados en propiedades
