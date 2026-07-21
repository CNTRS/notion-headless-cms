---
name: bifurcate-methods-via-cqs
description: Separar métodos que combinan lectura y mutación en dos: un comando (void, con efectos) y una consulta (retorno puro, sin efectos), aplicando el principio Command-Query Separation.
---

## 1. Activación (Triggers)

* Métodos con retorno distinto de `void` que simultáneamente modifican estado interno (`this.campo = x`) o parámetros mutables.
* Métodos llamados `get*` que realizan efectos secundarios (cambian estado, escriben logs, envían eventos).
* Métodos llamados `save*`, `update*`, `delete*` que retornan un valor (el ID guardado, el número de filas afectadas).
* Código que llama a un método para obtener un dato, pero como efecto secundario modifica el estado del sistema (sorpresa al caller).

## 2. Pasos de Implementación

1. **Identificar el método infractor** — aquel que tiene tipo de retorno no `void` y además modifica estado interno o parámetros.
2. **Analizar si la mutación es necesaria** — a veces la mutación puede eliminarse (cálculo puro) o hacerse antes/después.
3. **Extraer el comando**:
   - Crear un método `void` con la lógica mutadora.
   - Pasarle los parámetros que necesite.
   - El comando modifica el estado y no devuelve nada.
4. **Extraer la consulta**:
   - Crear un método que solo calcule y devuelva el resultado basado en el estado actual.
   - Sin efectos secundarios, sin modificar argumentos, sin modificar `this`.
5. **Reemplazar las llamadas originales**:
   - Si antes: `int x = obj.doSomething(params)` con efecto mutador
   - Ahora: `obj.doSomethingCommand(params); int x = obj.doSomethingQuery();`
6. **Verificar que todas las referencias quedan actualizadas** y los tests pasan.

## 3. Verificación

- [ ] El comando retorna `void` (o `Unit`, o similar) y solo produce efectos secundarios.
- [ ] La consulta retorna un valor y no modifica ningún estado (ni `this`, ni parámetros, ni estáticos).
- [ ] Llamar dos veces a la consulta con el mismo estado interno produce el mismo resultado.
- [ ] Todos los tests existentes pasan después de la separación.

## 4. Buenas Prácticas y Contraindicaciones

* ✅ Aplicar CQS por defecto en métodos de dominio (servicios, casos de uso, entidades).
* ✅ Las consultas deben ser **referencialmente transparentes** en la medida de lo posible.
* ❌ **No** aplicar CQS en operaciones que requieren atomicidad — si comando y consulta deben ejecutarse juntos, mantenerlos unidos y documentar la decisión.
* ❌ **No** aplicar CQS dogmáticamente en eventos de dominio o handlers que por naturaleza tienen efectos y retornos contextuales.
* ❌ **No** bifurcar si penaliza catastróficamente el rendimiento (ej: operación atómica que necesita el ID generado).

## 5. Skills Relacionadas

* `extract-guard-clauses-and-early-returns` — los comandos suelen beneficiarse de guard clauses al inicio
* `inject-dependencies-via-constructor` — las consultas suelen necesitar dependencias inyectadas
* `replace-predictable-exceptions-with-either-try` — los Either/Try son útiles en consultas para modelar fallos predecibles sin excepciones
* `mutate-code-via-tpp` — CQS puede aplicarse como parte de una transformación TPP
