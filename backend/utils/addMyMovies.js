const UserModel = require("../models/user");
const MovieModel = require("../models/movie");

const addMyMovie = async function (userId, movieId) {
  const promises = [];
  const movie = MovieModel.findOne({ _id: movieId });
  promises.push(movie);
  const user = UserModel.findOne({ _id: userId });
  promises.push(user);

  // eslint-disable-next-line no-undef
  await Promise.all(promises);
  user.myMovies.push(movie);
  user.save();
};

exports.addMyMovie = addMyMovie;
