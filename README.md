# RIU Frontend - Marta Naveira

Prueba técnica frontend desarrollada con Angular como SPA para el mantenimiento de superhéroes.

---

## Decisiones técnicas

### Versión de Angular
La prueba solicita el uso de la última versión LTS de Angular.

En el entorno local ya estaba disponible Angular CLI 18 junto con Node.js 20.14, lo que garantizaba compatibilidad completa sin modificar el entorno de trabajo habitual.

Se valoró el uso de Angular 20, pero requería una versión superior de Node.js, lo que podía afectar al entorno profesional actual.

Por este motivo se optó por Angular 18, priorizando:

- estabilidad del entorno
- rapidez de entrega
- compatibilidad total con la versión actual de Node
- uso de una versión ampliamente utilizada en proyectos reales

---

### Librería UI
Se seleccionó Angular Material como librería de interfaz por permitir una implementación rápida y consistente de:

- toolbar
- tablas
- paginación
- diálogos de confirmación
- formularios
- indicadores de carga

Además, es una mejora opcional valorada en la prueba.

---

### Simulación de API
Aunque el enunciado permite almacenar la información dentro del servicio, se decidió utilizar `json-server` para simular una API real.

Esta decisión se tomó porque:

- permite trabajar con `HttpClient`
- hace el CRUD más realista
- da sentido al uso de interceptores de carga, añadiremos un delay de todas formas
- mejora la calidad de los tests del servicio
- se aproxima más a un entorno productivo

La API mock se alimenta desde el archivo `db.json`.

---

## Modelo de datos
Se diseñó un modelo `Hero` equilibrado entre realismo y simplicidad.

Atributos:

- id
- name
- alias
- universe
- powerLevel
- city
- active
-description

---

## Arquitectura del proyecto
La estructura del proyecto sigue una separación modular orientada a responsabilidades:

```text
src/app
├── core
│   ├── layout
│   ├── interceptors
├── features
│   └── heroes
│       ├── models
│       ├── services
│       ├── pages
│       └── components
├── shared
    ├── directives
    └── components
```
---

## Layout global

Se ha utilizado una arquitectura basada en shell.

AppComponent únicamente renderiza el shell principal, mientras que el shell encapsula:

cabecera
router outlet
soporte futuro para footer u otros componentes

De este modo, la estructura visual global queda desacoplada de la lógica de negocio.

## Testing

Se ha mantenido el stack de testing por defecto de Angular:

Jasmine
Karma

Esto permite mantener la solución alineada con el ecosistema Angular y centrar el esfuerzo en la funcionalidad y la arquitectura.

## Cómo ejecutar el proyecto
1. Instalar dependencias
npm install
2. Levantar Angular
npm start
3. Levantar API mock
npm run api
4. Ejecutar tests
ng test