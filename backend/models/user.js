const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
  myMovies: [{ type: mongoose.Types.ObjectId, ref: "Movies" }],
});

const UserModel = mongoose.model("UserModel", UserSchema, "users");

module.exports = UserModel;
