const express = require("express");
const app = express();

// Importamos las rutas de usuarios
app.use(require("./usuario.routes"));
// Importamos las rutas de login
app.use(require("./login.routes"));

module.exports = app;
