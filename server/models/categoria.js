const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let categoriaSchema = new Schema(
  {
    descripcion: {
      type: String,
      unique: true,
      required: [true, "La descripción es obligatoria"],
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
  }
);

categoriaSchema.plugin(uniqueValidator, {
  message: "La {PATH} es obligatoria ",
});

module.exports = model("Categoria", categoriaSchema);
