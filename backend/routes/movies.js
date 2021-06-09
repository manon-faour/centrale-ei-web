const express = require("express");
const MovieModel = require("../models/movie");
const router = express.Router();
const myMovies = require("../utils/myMovies");
const evals = require("../utils/evals");

router.get("/", function (req, res) {
  MovieModel.find({}).then(function (movies) {
    res.json({ movies: movies });
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

router.post("/mymovies", function (req, res) {
  const userId = "60c0b549e9dad9aa14ca54c3";
  const movieId = req.body.movieId;
  myMovies.add(userId, movieId, res);
});

router.get("/mymovies", function (req, res) {
  const userId = "60c0b549e9dad9aa14ca54c3";
  myMovies.find(userId, res);
});

router.delete("/mymovies", function (req, res) {
  const userId = "60c0b549e9dad9aa14ca54c3";
  const movieId = req.body.movieId;
  myMovies.remove(userId, movieId, res);
});

module.exports = router;
