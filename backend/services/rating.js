const MovieModel = require("../models/movie");
const EvalModel = require("../models/eval");

/**
 * Calculates the average evalutation of a movie
 * @param  {String} movieId id of movie
 * @return {undefined}
 */
const average = async function (movieId) {
  const evals = await EvalModel.find({ movie: movieId });
  let note = 0;
  var i;
  for (i = 0; i < evals.length; i++) {
    note = note + evals[i].eval;
  }
  const number = evals.length;
  const movie = await MovieModel.findOne({ _id: movieId });
  movie.average_rating = note / number;
  movie.save();
};

exports.average = average;
