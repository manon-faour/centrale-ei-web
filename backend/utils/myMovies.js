const UserModel = require("../models/user");
const MovieModel = require("../models/movie");

const addMyMovie = async function (userId, movieId, res) {
  try {
    const movie = await MovieModel.findOne({ _id: movieId });
    const user = await UserModel.findOne({ _id: userId });

    user.myMovies.push(movie);
    user.save();
    res.status(201).json({ message: "all good" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const findMyMovies = async function (userId, res) {
  UserModel.findOne({ _id: userId })
    .populate("myMovies")
    .then(function (user) {
      res.json({ movies: user.myMovies });
    })
    .catch(function (err) {
      res.status(500).json({ message: err });
    });
};

exports.add = addMyMovie;
exports.find = findMyMovies;
