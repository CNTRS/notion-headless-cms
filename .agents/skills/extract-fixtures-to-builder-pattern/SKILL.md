---
name: extract-fixtures-to-builder-pattern
description: Simplificar el arrange de los tests extrayendo la creación de objetos complejos a un Builder fluido, eliminando setUp masivos y datos irrelevantes que lastran la legibilidad.
---

## 1. Activación (Triggers)

* Tests con bloques `setUp` o `beforeEach` extensos (> 10 líneas) que se repiten parcialmente en cada test.
* Tests que instancian objetos con muchos parámetros, pero solo usan unos pocos en cada escenario.
* Creación de objetos de prueba duplicada en múltiples archivos de test.
* Dificultad para entender qué datos son relevantes para cada test por el ruido de inicialización.

## 2. Pasos de Implementación

1. **Identificar el objeto ruidoso** — la clase que requiere muchos campos para construirse pero que en los tests rara vez se usan todos.
2. **Crear una clase Builder** con:
   - Todos los campos del objeto original con valores por defecto sensatos (típicos, no nulos).
   - Métodos `with<Campo>(valor)` que retornan `this` para encadenamiento.
   - Un método `.build()` que construye y retorna el objeto.
3. **Extraer sobrecargas semánticas** opcionales: métodos como `.withAltaPrioridad()` que configuran varios campos a la vez según un concepto de negocio.
4. **Reemplazar el setUp masivo**: cada test construye solo los datos que necesita con `new ObjetoBuilder().withX(x).withY(y).build()`.
5. **Eliminar el setUp global** si todos los tests usan ahora builders específicos.

## 3. Verificación

- [ ] Cada test especifica explícitamente solo los datos relevantes para su escenario.
- [ ] El builder produce un objeto válido incluso llamando solo a `.build()` (valores por defecto sensatos).
- [ ] No hay datos "zombie" en los tests — campos que se inicializan pero nunca se usan en la aserción.
- [ ] El setUp/beforeEach global se ha reducido o eliminado.

## 4. Buenas Prácticas y Contraindicaciones

* ✅ Los builders de test deben estar **en la carpeta de test**, no en producción.
* ✅ Usar valores por defecto obvios pero irrelevantes (`"nombre-cualquiera"`, `0`, `false`) para minimizar ruido.
* ✅ Nombrar los métodos `with` según el lenguaje ubicuo del dominio.
* ❌ **No** incluir lógica de negocio, condicionales o bucles en el builder de test.
* ❌ **No** crear un builder para cada clase — solo para aquellas que aparecen en múltiples tests con configuraciones variadas.
* ❌ **No** confundir el Builder de test con un Object Mother: el Builder es fluido y configurable; el Object Mother devuelve objetos preconfigurados.

## 5. Skills Relacionadas

* `regroup-test-suites-by-context` — complementario para organizar tests que comparten configuraciones de builder similares
* `encapsulate-primitives-in-value-objects` — los builders funcionan mejor cuando los campos son Value Objects con validación propia
* `inject-test-doubles` — los builders pueden integrar la creación de dobles de prueba
