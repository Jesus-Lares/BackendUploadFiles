const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "uploadFiles2021";

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La peticion no tiene cabecera de autenticacion." });
  }

  const token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt.decode(token, SECRET_KEY);

    if (payload.exp <= moment.unix()) {
      return res.status(404).send({ message: "El token ha expirado" });
    }
  } catch (error) {
    return res.status(404).send({ message: "Token invalido" });
  }

  req.user = payload;
};

const ensureAuthDelete = (req, res, next) => {
  const response = auth(req, res, next);
  if (response) {
    return response;
  }
  const token = req.headers.authorization.replace(/['"]+/g, "");
  var payload = jwt.decode(token, SECRET_KEY);
  if (payload.role !== "admin") {
    return res
      .status(403)
      .send({ message: "Se necesitan permisos de administrador" });
  }
  next();
};
const ensureAuth = (req, res, next) => {
  const response = auth(req, res, next);
  if (response) {
    return response;
  }
  next();
};

module.exports = {
  ensureAuth,
  ensureAuthDelete,
};
