const express = require("express");

const UserController = require("../controllers/users");
const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers);
api.delete(
  "/delete-user/:id",
  [md_auth.ensureAuthDelete],
  UserController.deleteUser
);

module.exports = api;
