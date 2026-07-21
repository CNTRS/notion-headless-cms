---
name: pragmatic-architecture-guidelines
description: Validador estático de reglas de diseño arquitectónico. Esta skill no ejecuta pasos; valida que el código propuesto cumpla con las restricciones de desacoplamiento e invariantes de negocio usando el paradigma Hexagonal Pragmático + DDD Táctico + TDD Pragmático.
---

### 🛡️ REGLA 1: Capa de Dominio Pura (`src/domain/`)
El dominio representa el núcleo del negocio. Debe permanecer agnóstico a cualquier tecnología de entrada o salida.
* **Invariante de Dependencias:** Queda estrictamente prohibido cualquier `import` de librerías externas (`npm`), frameworks o módulos nativos de Node.js (`fs`, `crypto`, `path`, `http`). Solo se permite JavaScript/TypeScript nativo y primitivos.
* **Objetos de Valor (Value Objects):** Clases inmutables para datos con validación estructural (ej. `Email`, `Id`). El constructor debe validar las reglas de negocio inmediatamente y lanzar excepciones si no se cumplen.
* **Entidades (Entities):** Clases con identidad propia (ej. `User`, `StaticPage`).
  * Su constructor debe ser **privado**.
  * La instanciación debe forzarse mediante un método factoría estático: `public static create(...): EntityName`.

### 🔌 REGLA 2: Capa de Puertos (`src/ports/`)
Los puertos definen la frontera del hexágono mediante contratos de interfaz.
* **Aislamiento de Tipos:** Las interfaces de los puertos (`interface`) solo pueden recibir o devolver tipos de datos primitivos o entidades/objetos de valor definidos en la capa de `domain`.
* **Prohibición de Filtrado de SDKs:** Ningún tipo de datos, interfaz o clase propia de una librería de terceros (ej. `NotionResponse`, `AxiosResponse`, `PrismaClient`) puede aparecer en la firma de un puerto.

### ⚙️ REGLA 3: Capa de Infraestructura (`src/infrastructure/`)
La infraestructura contiene los detalles técnicos y adaptadores del mundo exterior.
* **Inversión de Control:** Cualquier clase o módulo en esta capa que maneje persistencia o I/O debe implementar explícitamente un puerto (`implements PortName`).
* **Responsabilidad de Mapeo (Translators):** El adaptador es el encargado de capturar las respuestas del software de terceros (SDKs, Base de Datos, APIs) y transformarlas ("mapearlas") a los modelos limpios que el dominio espera antes de transferir el control.

### 🧪 REGLA 4: TDD Pragmático y Regla del Boy Scout
El desarrollo guiado por pruebas garantiza la pureza del diseño y la mantenibilidad a largo plazo.
* **Ciclo Red-Green-Refactor:** 1. **Red:** Escribe un test que falle expresando la necesidad del negocio en el lenguaje ubicuo.
  2. **Green:** Escribe el código mínimo necesario (incluso "sucio") para que el test pase.
  3. **Refactor:** Limpia el código eliminando duplicidades, mejorando nombres y estructurando el diseño sin romper el test.
* **Pruebas de Comportamiento Puro:** Los tests del dominio se ejecutan en memoria. Queda prohibido el uso de herramientas de simulación de infraestructura complejas (como mocks de red, *testcontainers* o parcheos globales). Las entradas complejas se simulan mediante *Fixtures* (objetos constantes o archivos JSON planos).
* **La Regla del Boy Scout (Mejora Continua):** Está prohibido terminar una tarea dejando el código igual.
  * En *Greenfield*, el paso de "Refactor" debe pulir la legibilidad y modularidad antes de dar el paso por cerrado.
  * En *Brownfield*, antes de modificar código heredado, se deben escribir *tests de caracterización* (que fijen el comportamiento actual) para garantizar que la posterior extracción a dominio purifique el código sin introducir regresiones.

---
### 🚨 Antipatrones Críticos a Detectar
* **Anidamiento Técnico:** Pasar configuraciones de entorno (`process.env`) o rutas físicas al dominio.
* **Tipado Contaminado:** Importar tipos de terceros en puertos o dominio debido a la "comodidad" de no remapear la estructura.
* **Test Frágil:** Tests de dominio que se rompen al cambiar la infraestructura de la base de datos o el SDK externo.