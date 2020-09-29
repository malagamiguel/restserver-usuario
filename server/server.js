// Requerimientos
require("./config/config");

const express = require("express");

// Mongoose
const mongoose = require("mongoose");

const app = express();

const bodyParser = require("body-parser");

// Configuración del puerto
// app.set("port", process.env.PORT || 3000);

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Importamos las rutas de usuarios
app.use(require("./routes/usuario.routes"));

// Configuración a la base de datos
mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, res) => {
    if (err) throw err;

    console.log("Base de datos conectada");
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Aplicación corriendo en el puerto ${process.env.PORT}`);
});
