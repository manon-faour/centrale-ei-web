const EvalModel = require("../models/eval");

const evalMovie = function (userId, movieId, evaluation) {
  return EvalModel.findOneAndUpdate(
    {
      movie: movieId,
      user: userId,
    },
    { eval: evaluation },
    { new: true, upsert: true }
  );
};

const findEval = function (userId, movieId) {
  return EvalModel.findOne({ movie: movieId, user: userId });
};

exports.eval = evalMovie;
exports.find = findEval;
