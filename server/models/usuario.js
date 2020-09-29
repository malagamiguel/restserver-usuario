const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol válido",
};

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es necesario"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "El correo es necesario"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatorio"],
    },
    img: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "USER_ROLE",
      enum: rolesValidos,
    },
    estado: {
      type: Boolean,
      default: true,
    },
    google: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

usuarioSchema.methods.toJSON = function () {
  // this en este caso hara referencia a lo devuelto por usuarioSchema
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

usuarioSchema.plugin(uniqueValidator, {
  message: "{PATH} debe de ser único",
});

module.exports = model("Usuario", usuarioSchema);
