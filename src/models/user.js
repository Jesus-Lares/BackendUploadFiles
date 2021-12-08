const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchame = Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: String,
  files: [String],
});
module.exports = mongoose.model("User", UserSchame);
