const express = require("express");
const app = express();

// Importamos las rutas de usuarios
app.use(require("./usuario.routes"));
// Importamos las rutas de login
app.use(require("./login.routes"));
// Importamos las rutas de categoria
app.use(require("./categoria.routes"));
// Importamos las rutas de productos
app.use(require("./producto.routes"));
// Importamos las rutas de carga de archivos
app.use(require("./upload.routes"));
// Importamos las rutas muestra de imagenes
app.use(require("./imagenes.routes"));

module.exports = app;
