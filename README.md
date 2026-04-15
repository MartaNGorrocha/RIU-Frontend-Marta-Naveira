# RIU Frontend - Marta Naveira

Prueba técnica frontend desarrollada con **Angular como SPA** para el mantenimiento de superhéroes.

La aplicación incluye:

* listado paginado
* alta
* edición
* detalle
* borrado con confirmación
* filtrado por alias
* tests unitarios
* UI con Angular Material
* API mock con `json-server`

---

## Decisiones técnicas

### Versión de Angular

La prueba solicita el uso de la última versión LTS de Angular.

En el entorno local ya estaba disponible **Angular CLI 18 junto con Node.js 20.14**, lo que garantizaba compatibilidad completa sin modificar el entorno de trabajo habitual.

Se valoró el uso de Angular 20, pero requería una versión superior de Node.js, lo que podía afectar al entorno profesional actual.

Por este motivo se optó por **Angular 18**, priorizando:

* estabilidad del entorno
* rapidez de entrega
* compatibilidad total con la versión actual de Node
* uso de una versión ampliamente utilizada en proyectos reales

---

### Librería UI

Se seleccionó **Angular Material** como librería de interfaz por permitir una implementación rápida y consistente de:

* toolbar
* tablas
* paginación
* diálogos de confirmación
* formularios
* indicadores de carga

Además, es una mejora opcional valorada en la prueba.

---

### Simulación de API

Aunque el enunciado permite almacenar la información dentro del servicio, se decidió utilizar **`json-server` para simular una API real**.

Esta decisión se tomó porque:

* permite trabajar con `HttpClient`
* hace el CRUD más realista
* da sentido al uso de interceptores de carga
* mejora la calidad de los tests del servicio
* se aproxima más a un entorno productivo

La API mock se alimenta desde el archivo `db.json`.

---

## Estructura del proyecto

```text
src/
 ├── app/
 │   ├── core/
 │   │   ├── layout/
 │   │   └── interceptors/
 │   ├── features/
 │   │   └── heroes/
 │   │       ├── models/
 │   │       ├── constants/
 │   │       ├── services/
 │   │       ├── pages/
 │   │       ├── components/
 │   │       └── resolvers/
 │   └── shared/
 │       ├── directives/
 │       └── components/
 └── styles.css

public/
     └── escudo.png
```

### Carpeta `public`

Se ha utilizado la carpeta `public/` para recursos estáticos globales como el logo.

Esto permite:

* servir el archivo desde la raíz (`/escudo.png`)
* desacoplar recursos de branding de la estructura interna de Angular
* mantener una separación clara entre recursos globales y recursos ligados a features

Se ha priorizado esta aproximación frente a `assets/` al tratarse de un recurso visual global de la aplicación.

---

## Modelo de datos

Se diseñó un modelo `Hero` equilibrado entre **realismo, simplicidad y tipado fuerte**.

```ts
export interface Hero {
  id: string;
  name: string;
  alias: string;
  universe: HeroUniverse;
  powerLevel: number;
  city: string;
  active: boolean;
  description: string;
}
```

### Universo

Se ha evitado duplicar strings usando una constante centralizada.

```ts
export const HERO_UNIVERSES = ['Marvel', 'DC'] as const;
export type HeroUniverse = typeof HERO_UNIVERSES[number];
```

Ventajas:

* fuente única 
* reutilizable en formularios y filtros
* evita errores tipográficos
* mejora la escalabilidad

### Modo del formulario

También se ha extraído el modo del formulario a un tipo reutilizable:

```ts
export type HeroFormMode = 'create' | 'edit' | 'detail';
```

Esto desacopla la lógica de UI del componente y facilita su reutilización en rutas o resolvers.

---

## Arquitectura y layout global

Se ha utilizado una arquitectura basada en **shell layout**.

`AppComponent` únicamente renderiza el shell principal, mientras que este encapsula:

* cabecera
* router outlet
* soporte futuro para footer u otros componentes

De este modo, la estructura visual global queda desacoplada de la lógica de negocio.

La organización por carpetas sigue una separación clara por responsabilidades:

* `core`: layout, interceptores y piezas globales
* `features`: dominio funcional de héroes
* `shared`: directivas y componentes reutilizables

---

## Estilos y personalización de Angular Material

Para ciertos ajustes visuales puntuales sobre componentes internos de Angular Material se ha usado:

```css
:host ::ng-deep
```

Ejemplo:

```css
:host ::ng-deep .heroes-filter-field .mat-mdc-text-field-wrapper {
  background: transparent !important;
}
```

### Justificación

Angular Material genera estructura DOM interna que no siempre queda cubierta por la encapsulación de estilos del componente.

En esos casos se ha usado `::ng-deep` **de forma localizada y controlada**, siempre:

* limitado a una clase propia
* dentro del CSS del componente
* evitando contaminar estilos globales

Se trata de una solución puntual para personalización visual sin afectar al resto de la aplicación.

---

## Testing

Se ha mantenido el stack de testing por defecto de Angular:

* Jasmine
* Karma

Esto permite mantener la solución alineada con el ecosistema Angular y centrar el esfuerzo en la funcionalidad y la arquitectura.

Se han desarrollado tests unitarios para:

* servicios
* componentes principales
* diálogo de borrado
* resolver
* directiva

### Caso conocido con Angular Material

Existe un caso concreto relacionado con el test del filtrado en `HeroesListComponent`.

La combinación de:

* `MatTable`
* `MatPaginator`
* `MatTableDataSource`
* render interno de Angular Material

puede provocar errores internos de renderizado durante Karma/Jasmine al modificar `dataSource.filter` dentro del test.

La lógica funcional del filtrado está implementada y validada en ejecución real, pero el test unitario aislado de este caso presenta inestabilidad por dependencias internas de Angular Material.

Por este motivo se ha priorizado:

* mantener cobertura estable del resto del componente
* no introducir mocks artificiales complejos del paginator
* evitar falsos negativos en CI

Es una limitación conocida del render interno de `MatTableDataSource` en tests unitarios puros.

---

## Cómo ejecutar el proyecto

### 1) Instalar dependencias

```bash
npm install
```

### 2) Levantar Angular

```bash
npm start
```

### 3) Levantar API mock

```bash
npm run api
```

### 4) Ejecutar tests

```bash
ng test
```


**Marta Naveira**
