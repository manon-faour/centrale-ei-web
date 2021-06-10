const EvalModel = require("../models/eval");

/**
 * evaluates a movie. Creates an eval if one does not exist, or update one.
 * @param  {String} userId id of user
 * @param  {String} movieId id of movie
 * @param  {Number} evaluation new evaluation
 * @return {function}
 */
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

/**
 * finds the evaluation of a movie
 * @param  {String} userId id of user
 * @param  {String} movieId id of movie
 * @return {function}
 */
const findEval = function (userId, movieId) {
  return EvalModel.findOne({ movie: movieId, user: userId });
};

exports.eval = evalMovie;
exports.find = findEval;
