
# BackEnd-e-commerce

BackEnd-e-commerce es una API robusta y escalable para la gestión de un e-commerce, desarrollada en Node.js con Express y MongoDB. El proyecto implementa autenticación, autorización, gestión de productos, carritos, usuarios, compras y vistas dinámicas con Handlebars. Está diseñado para ser fácilmente mantenible y extensible.

## Características principales

- Gestión de productos: CRUD completo, paginación y búsqueda.
- Gestión de carritos de compra y tickets de compra.
- Registro, login y autenticación de usuarios con JWT y Passport.
- Rutas protegidas y control de roles (admin/usuario).
- Vistas dinámicas con Handlebars para la interacción de usuarios.
- Subida de imágenes y archivos con Multer.
- Middleware de autorización y manejo de errores.
- Variables de entorno para configuración segura.
- Testing automatizado con Mocha y Supertest.


## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- Passport (JWT y Local)
- Express-Handlebars
- Multer
- Mocha y Supertest (testing)
- dotenv

## Instalación

```bash
npm install
```


## Variables de entorno

Copia el archivo `.env.example` a `.env` y completa los valores necesarios para la conexión a la base de datos, claves JWT, puerto, etc.


## Scripts

- `npm run dev` - Ejecuta el servidor en modo desarrollo con nodemon
- `npm start` - Ejecuta el servidor en modo producción
- `npm test` - Ejecuta los tests


## Testing

```bash
npm test
```

src/

## Estructura del proyecto

```
src/
  app.js                # Configuración principal de la app y servidores
  controllers/          # Lógica de negocio de cada recurso (productos, carritos, usuarios, etc.)
  services/             # Servicios y lógica de acceso a datos
  routes/               # Definición de rutas y endpoints
  dao/                  # Data Access Objects y modelos de base de datos
    models/             # Esquemas de Mongoose
  dtos/                 # Data Transfer Objects para respuestas seguras
  middleware/           # Middlewares personalizados (auth, manejo de errores, etc.)
  config/               # Configuración de entorno y Passport
  public/               # Archivos estáticos (imágenes, CSS)
  views/                # Vistas Handlebars para el frontend
  utils/                # Utilidades generales y helpers
  tests/                # Pruebas automatizadas
```


## ¿Cómo contribuir?

¡Pull requests y sugerencias son bienvenidos! Por favor, abre un issue para discutir cambios importantes antes de hacer un PR.

## Licencia

Este proyecto está bajo la licencia ISC.
