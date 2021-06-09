const express = require("express");
const MovieModel = require("../models/movie");
const router = express.Router();
const addMyMovies = require("../utils/addMyMovies");

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

router.post("/mymovies", function (req, res) {
  try {
    const userId = "60bf75dc6591e9a836da622a";
    const movieId = req.body.movieId;
    addMyMovies(userId, movieId);
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
