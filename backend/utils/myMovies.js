const UserModel = require("../models/user");
const MovieModel = require("../models/movie");

const addMovie = async function (userId, movieId, res) {
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
  try {
    const user = await UserModel.findOne({ _id: userId }).populate("myMovies");
    console.log(user);
    res.status(201).json({ movies: user.myMovies });
  } catch (err) {
    res.status(500).json({ message: err });
  }
  // UserModel.findOne({ _id: userId })
  //   .populate("myMovies")
  //   .then(function (user) {
  //     res.json({ movies: user.myMovies });
  //   })
  //   .catch(function (err) {
  //     res.status(500).json({ message: err });
  //   });
};

const removeMovie = async function (userId, movieId, res) {
  UserModel.findOne({ _id: userId })
    .then(function (user) {
      user.myMovies.pull({ _id: movieId });
      user.save();
      res.status(201);
    })
    .catch(function (err) {
      res.status(500).json({ message: err });
    });
};

exports.add = addMovie;
exports.find = findMyMovies;
exports.remove = removeMovie;
