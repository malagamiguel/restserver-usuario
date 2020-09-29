const express = require("express");

const bcrypt = require("bcrypt");
const _ = require("underscore");

const Usuario = require("../models/usuario.js");

// Importamos los middlewares
const {
  verificaToken,
  verificaAdmin_Role,
} = require("../middlewares/autenticacion");

const app = express();

// OBTENER USUARIOS
app.get("/usuario", verificaToken, (req, res) => {
  // return res.json({
  //   usuario: req.usuario,
  //   nombre: req.usuario.nombre,
  //   email: req.usuario.email,
  // });

  // parámetros opcionales
  // se mandar por url
  // http://localhost:3000/usuario?desde=2&limite=4
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  // Dentro de las {} irían las condiciones
  // {google:true}
  Usuario.find({ estado: true }, "nombre email role estado google img")
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      // Dentro de las {} irían las condiciones
      // {google:true}
      Usuario.estimatedDocumentCount({ estado: true }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo,
        });
      });
    });
});

// CREAR USUARIOS
app.post("/usuario", [verificaToken, verificaAdmin_Role], (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    // usuarioDB.password = null;

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

// ACTUALIZAR USUARIOS
app.put("/usuario/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    // new: true, devuelve el usuario actualizado
    // runValidator: true, hace que se usen las validaciones del modelo
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

// ELIMINAR USUARIOS
app.delete("/usuario/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
  let id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado",
        },
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado,
    });
  });
});

// CAMBIAR ESTADO DE USUARIO
app.patch(
  "/usuario/:id",
  [verificaToken, verificaAdmin_Role],
  async (req, res) => {
    let id = req.params.id;

    let data = await Usuario.findById(id, "estado").exec();

    let cambiaEstado = {
      estado: !data.estado,
    };

    Usuario.findByIdAndUpdate(
      id,
      cambiaEstado,
      { new: true },
      (err, usuarioDesactivado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!usuarioDesactivado) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "Usuario no encontrado",
            },
          });
        }

        res.json({
          ok: true,
          usuario: usuarioDesactivado,
        });
      }
    );
  }
);

module.exports = app;
