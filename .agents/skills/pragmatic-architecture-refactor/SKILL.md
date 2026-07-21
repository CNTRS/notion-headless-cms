---
name: pragmatic-architecture-refactor
description: Guía estratégica para la migración incremental hacia una arquitectura limpia sin alterar su comportamiento externo. Requiere cargar activamente la skill `pragmatic-architecture-guidelines` para garantizar las buenas prácticas arquitectónicas durante la refactorización.
---

### 🗺️ Mapa de Flujo de Refactorización

```text
CÓDIGO ACOPLADO             PASO A PASO                     HEXAGONAL PRAGMÁTICO
┌──────────────────┐        1. Extraer Lógica Pura         ┌──────────────────┐
│ Comando CLI      │ ─────> 2. Crear Interfaz (Puerto) ──> │ Dominio (Puro)   │
│  - Lee Disco     │        3. Mover I/O a Adaptador       ├──────────────────┤
│  - Cambia Datos  │                                       │ Puerto / Adapter │
│  - Guarda Disco  │                                       └──────────────────┘
└──────────────────┘
```

---

### 🔄 Pasos de Ejecución

#### Paso 1: Identificar y Aislar los "Efectos Secundarios"
Analiza el archivo o script heredado e identifica todas las líneas que interactúan con factores externos al proceso lógico.
* **Puntos Críticos a Buscar:**
  * Peticiones de red o llamadas de API (`fetch`, `axios`, SDKs de terceros).
  * Operaciones de sistemas de archivos (`fs.readFileSync`, `fs.writeFileSync`, `path.join`).
  * Lecturas globales de entorno (`process.env`).
  * Captura de inputs o salidas por consola (`readline`, `prompts`, `console.log`).

#### Paso 2: Asegurar con Tests de Caracterización (TDD Inverso)
* **Acción:** Antes de modificar o cortar una sola línea de código, escribe un test que ejecute el script actual con una entrada controlada y valide que produce la salida actual (incluso si la salida actual tiene un formato heredado o "sucio").
* **Foco de Validación:** [Cargar SKILL: pragmatic-architecture-guidelines -> Consultar REGLA 4 (Boy Scout)]. Esta prueba es tu seguro de vida. Garantiza que tienes una base estable para aplicar la Regla del Boy Scout y dejar el código mejor sin alterar su comportamiento externo.

#### Paso 3: Extraer la Lógica de Negocio (El Núcleo Puro)
Separa el procesamiento de datos de las operaciones de Entrada/Salida (I/O).
* **Acción:** Selecciona el bloque de código intermedio encargado de transformar, validar, filtrar o procesar los datos extraídos en el Paso 1.
* **Refactor:** Córtalo y muévelo a una función o clase pura dentro de un archivo independiente en `src/domain/`. Ejecuta inmediatamente el test del Paso 2 para comprobar que no has roto nada.
* **Regla Estricta:** Esta nueva función de dominio debe recibir parámetros con datos primitivos o estructurados limpios y retornar un resultado plano. No puede contener lógica asíncrona ligada a infraestructura ni promesas externas.
* **Foco de Validación:** [Cargar SKILL: pragmatic-architecture-guidelines -> Consultar REGLA 1: Capa de Dominio Pura]. Fuerza a que esta nueva pieza extraída sea limpia, síncrona, libre de dependencias y legible.

#### Paso 4: Crear el Puerto de Salida
Determina las necesidades de información que la lógica pura requiere del mundo exterior.
* **Acción:** Diseña una interfaz (`interface`) de TypeScript en `src/ports/` que firme los métodos necesarios para proveer o persistir dichos datos estructurados de forma agnóstica a la tecnología.
* **Foco de Validación:** [Cargar SKILL: pragmatic-architecture-guidelines -> Consultar REGLA 2: Capa de Puertos]. Comprueba que la interfaz use tipos limpios.

#### Paso 5: Aislar el Código Antiguo en un Adaptador
Encapsula el código técnico original para que sirva al dominio de forma controlada.
* **Acción:** Traslada las líneas de código de infraestructura identificadas en el Paso 1 (aquellas que invocaban el SDK o interactuaban con el disco) a una clase dentro de `src/infrastructure/`.
* **Implementación:** Asegúrate de que esta clase implemente la interfaz del puerto correspondiente (`implements PortName`). Su responsabilidad exclusiva será traducir el formato "sucio" u originario del tercero al formato estructurado y limpio que exige nuestro dominio.
* **Foco de Validación:** [Cargar SKILL: pragmatic-architecture-guidelines -> Consultar REGLA 3: Capa de Infraestructura]. Comprueba que el adaptador se encargue de mapear las respuestas sucias del exterior a entidades de dominio.

#### Paso 6: El "Cableado" Final y Verificación
Reconecta los componentes asegurando la preservación del comportamiento original.
* **Acción:** Vuelve al archivo original (ej. el comando CLI o script principal).
* **Orquestación:** 1. Instancia el nuevo adaptador de infraestructura.
  2. Invoca el adaptador para recuperar los datos requeridos.
  3. Envía los datos recuperados a la función o entidad pura de dominio.
  4. Pasa el resultado arrojado por el dominio al adaptador encargado de la salida (ej. guardar en base de datos, escribir en disco o imprimir en terminal).
* **Foco de Validación:** [Cargar SKILL: pragmatic-architecture-guidelines -> Consultar REGLA 4 (Boy Scout)]. Ejecuta la suite de pruebas unitarias o de integración para validar que el comportamiento de la aplicación de cara al usuario final permanezca inalterado.Una vez comprobado que el test del Paso 2 sigue en verde, realiza una última pasada de limpieza en el punto de entrada original eliminando variables muertas, simplificando flujos y garantizando que el archivo final queda ostensiblemente más ordenado, legible y robusto que cuando lo abriste.

---

### ⚠️ Reglas Antipatrón a Evitar durante la Refactorización
* **No arrastrar SDKs:** Si un parámetro de la función de dominio expone un tipo propio de una librería de terceros (ej. `NotionResponse`), la refactorización ha fallado. Modela un tipo genérico propio.
* **No saltearse el Puerto:** Evita conectar el archivo original directamente a la infraestructura sin pasar por la abstracción de la interfaz en la capa de puertos.