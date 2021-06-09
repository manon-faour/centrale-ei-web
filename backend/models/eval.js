const mongoose = require("mongoose");

const EvalSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "UserModel", required: true },
  movie: { type: mongoose.Types.ObjectId, ref: "MovieModel", required: true },
  eval: { type: Number, required: true },
});

const EvalModel = mongoose.model("EvalModel", EvalSchema, "evals");

module.exports = EvalModel;
