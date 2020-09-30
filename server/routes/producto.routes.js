const express = require("express");
const { verificaToken } = require("../middlewares/autenticacion");

const app = express();

let Producto = require("../models/producto");

// -----------------------------------------------------------------
// Mostrar todas los productos
// -----------------------------------------------------------------
app.get("/productos", verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

// -----------------------------------------------------------------
// Mostrar producto por ID
// -----------------------------------------------------------------
app.get("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El id no es valido",
          },
        });
      }

      res.json({
        ok: true,
        categoria: productoDB,
      });
    });
});

// -----------------------------------------------------------------
// Buscar productos
// -----------------------------------------------------------------
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;
  // expresion regular
  let regex = new RegExp(termino, "i");

  Producto.find({ nombre: regex })
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.status(200).json({
        ok: true,
        productos,
      });
    });
});

// -----------------------------------------------------------------
// Crear un producto
// -----------------------------------------------------------------
app.post("/productos", verificaToken, (req, res) => {
  let body = req.body;
  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.status(200).json({
      ok: true,
      producto: productoDB,
    });
  });
});

// -----------------------------------------------------------------
// Actualizar un producto
// -----------------------------------------------------------------
app.put("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El ID no existe",
        },
      });
    }

    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.descripcion;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoGuardado,
      });
    });
  });
});

// -----------------------------------------------------------------
// Eliminar un producto
// -----------------------------------------------------------------
app.delete("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El ID no existe",
        },
      });
    }

    productoDB.disponible = false;

    productoDB.save((err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoBorrado,
        mensaje: "Producto borrado",
      });
    });
  });
});

module.exports = app;
