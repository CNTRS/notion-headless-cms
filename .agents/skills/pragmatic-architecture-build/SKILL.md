---
name: pragmatic-architecture-build
description: Guía de ejecución paso a paso para el desarrollo de funcionalidades aisladas. Requiere cargar activamente la skill `pragmatic-architecture-guidelines` para garantizar un dominio puro y contratos desacoplados usando el paradigma Hexagonal Pragmático + DDD Táctico + TDD Pragmático
---

### 📋 Prerrequisitos y Estructura
Asegúrate de que tu espacio de trabajo cuente con la siguiente estructura base dentro de `src/`:

```text
src/
├── domain/         # Núcleo lógico puro (Sin dependencias externas)
├── ports/          # Contratos de entrada y salida (Interfaces)
└── infrastructure/ # Implementaciones técnicas (I/O, Bases de datos, SDKs)
```

---

### 📋 Estructura de Trabajo
Crea la estructura física en `src/` antes de comenzar: `domain/`, `ports/`, `infrastructure/`.

### 🛠️ Pasos de Ejecución

#### Paso 1: Definir el Lenguaje Ubicuo
* **Acción:** Escribe un glosario de 3 a 5 términos clave del negocio.
* **Enfoque:** Ignora los nombres técnicos de las APIs externas. Si el negocio lo llama `Parrafo`, tu código interno usará `Parrafo` sin importar cómo lo lo llame el proveedor externo.

#### Paso 2: Escribir el Test de Dominio (TDD - Fase RED)
* **Acción:** Crea el archivo de pruebas en tu suite antes de que exista la lógica. Diseña el caso de prueba usando *fixtures* JSON que representen el estado inicial y el resultado esperado del negocio.
* **Foco de Validación:** [Cargar SKILL: skill-pragmatic-architecture-guidelines -> Consultar REGLA 4: TDD Pragmático]. Comprueba que el test falla por los motivos correctos (falta de implementación) y que describe un comportamiento puro del negocio.

#### Paso 3: Modelar el Dominio Puro (TDD - Fase GREEN)
* **Acción:** Crea las entidades y objetos de valor dentro de `src/domain/` para hacer que el test del Paso 2 pase a verde.
* **Foco de Validación:** [Cargar SKILL: skill-pragmatic-architecture-guidelines -> Consultar REGLA 1: Capa de Dominio Pura]. Asegura que los constructores cumplan las restricciones de privacidad, factorías estáticas y ausencia total de imports externos.

#### Paso 4: Declarar los Puertos de Entrada/Salida y Refactorizar (TDD - Fase REFACTOR)
* **Acción:** Diseña los contratos TypeScript dentro de `src/ports/` y refactora el código del dominio para acoplarlo a estas abstracciones.
* **Foco de Validación:** [Cargar SKILL: skill-pragmatic-architecture-guidelines -> Consultar REGLA 2 y REGLA 4 (Boy Scout)]. Aprovecha que tienes la red de seguridad del test para limpiar el código, refinar nombres del dominio y asegurar un diseño de puertos pulcro y agnóstico.

#### Paso 5: Desarrollar la Infraestructura y Conectar
* **Acción:** Implementa los adaptadores en `src/infrastructure/` y realiza el cableado manual en `src/index.ts`.
* **Foco de Validación:** [Cargar SKILL: skill-pragmatic-architecture-guidelines -> Consultar REGLA 3: Capa de Infraestructura]. Confirma que el adaptador traduzca los datos del SDK externo al formato del dominio antes de retornarlos.

---

### ⚠️ Lista de Control de Calidad (Checklist)
- [ ] ¿El directorio `src/domain/` está completamente libre de dependencias externas?
- [ ] ¿Los constructores de las entidades son privados y usan métodos estáticos `.create()`?
- [ ] ¿Los puertos (`src/ports/`) dependen únicamente de entidades del dominio?
- [ ] ¿El archivo `src/index.ts` realiza la instanciación y conexión manual de adaptadores?
- [ ] ¿Todos los tests del dominio pasan? ¿Son robustos frente a cambios en las otras capas?