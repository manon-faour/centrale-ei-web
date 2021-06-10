const express = require("express");
const MovieModel = require("../models/movie");
const UserModel = require("../models/user");
const router = express.Router();
const evals = require("../utils/evals");
const rating = require("../utils/rating");

router.get("/", function (req, res) {
  MovieModel.find({}).then(function (movies) {
    res.json({ movies: movies });
  });
});

router.get("/top/:nb", function (req, res) {
  MovieModel.find({})
    .sort({ average_rating: -1 })
    .limit(parseInt(req.params.nb))
    .then(function (movies) {
      res.status(201).json({ movies: movies });
    });
});

router.post("/new", function (req, res) {
  const newMovie = new MovieModel({
    title: req.body.title,
    description: req.body.description,
    release_date: req.body.release_date,
    poster_path: req.body.poster_path,
    average_rating: req.body.average_rating,
    genre_ids: req.body.genre_ids,
  });

  newMovie
    .save()
    .then(function (newDocument) {
      res.status(201).json(newDocument);
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

router.post("/eval", function (req, res) {
  const movieId = req.body.movieId;
  const userId = req.body.userId;
  const evaluation = req.body.eval;
  evals
    .eval(userId, movieId, evaluation)
    .then(function (newDocument) {
      rating.average(movieId);
      res.status(201).json(newDocument);
      return true;
    })
    .catch(function (error) {
      res.status(500).json({ message: error });
    });
});

router.get("/eval", function (req, res) {
  const movieId = req.body.movieId;
  const userId = req.body.userId;
  evals
    .find(userId, movieId)
    .then(function (evaluation) {
      if (evaluation) {
        res.status(201).json({ eval: evaluation.eval });
        return;
      }
      res.status(201).json({ eval: 0 });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

router.post("/mymovies", async function (req, res) {
  const userId = "60c0b549e9dad9aa14ca54c3";
  const movieId = req.body.movieId;
  try {
    const movie = await MovieModel.findOne({ _id: movieId });
    const user = await UserModel.findOne({ _id: userId });

    user.myMovies.push(movie);
    user.save();
    res.status(201).json({ message: "all good" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/mymovies", async function (req, res) {
  const userId = "60c0b549e9dad9aa14ca54c3";
  try {
    const user = await UserModel.findOne({ _id: userId }).populate("myMovies");
    console.log(user);
    res.status(201).json({ movies: user.myMovies });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete("/mymovies", function (req, res) {
  const userId = "60c0b549e9dad9aa14ca54c3";
  const movieId = req.body.movieId;
  UserModel.findOne({ _id: userId })
    .then(function (user) {
      user.myMovies.pull({ _id: movieId });
      user.save();
      res.status(201).end();
    })
    .catch(function (err) {
      res.status(500).json({ message: err });
    });
});

module.exports = router;
