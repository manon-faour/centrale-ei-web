const mongoose = require("mongoose");

const EvalSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  movie: { type: mongoose.Types.ObjectId, ref: "movies", required: true },
  eval: { type: Number, required: true },
});

const EvalModel = mongoose.model("EvalModel", EvalSchema, "evals");

module.exports = EvalModel;
