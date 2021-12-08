const bcrypt = require("bcrypt-nodejs");

const jwt = require("../services/jwt");
const User = require("../models/user");

const signUp = (req, res) => {
  const user = new User();
  const { email, name, password } = req.body;
  user.email = email.toLowerCase();
  user.name = name;
  user.role = "user";
  user.files = [];

  bcrypt.hash(password, null, null, (err, hash) => {
    if (err) {
      res.status(500).send({ message: "Error al encriptar las contraseñas" });
    } else {
      user.password = hash;

      user.save((err, userStored) => {
        if (err) {
          res.status(500).send({ message: "El usuario ya existe" });
        } else {
          if (!userStored) {
            res.status(404).send({ message: "Error al crear el usuario" });
          } else {
            res.status(200).send({ user: userStored });
          }
        }
      });
    }
  });
};

const signIn = (req, res) => {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor" });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "Usuario no encontrado" });
      } else {
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: "Error del servidor" });
          } else {
            if (!check) {
              res.status(404).send({ message: "La contraseña es incorrecta" });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
};

const getUsers = (req, res) => {
  User.find().then((users) => {
    if (!users) {
      res.status(404).send({ message: "No se ha encontrado ningun usuario" });
    } else {
      res.status(200).send({ users });
    }
  });
};
const deleteUser = (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id, (err, userDeleted) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor" });
    } else {
      if (!userDeleted) {
        res.status(404).send({ message: "No se ha encontrado el usuario" });
      } else {
        res.status(200).send({ message: "Usuario eliminado correctamente" });
      }
    }
  });
};

module.exports = {
  signUp,
  signIn,
  getUsers,
  deleteUser,
};
