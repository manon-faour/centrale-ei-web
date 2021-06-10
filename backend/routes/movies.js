const express = require("express");
const MovieModel = require("../models/movie");
const UserModel = require("../models/user");
const router = express.Router();
const evals = require("../services/evals");
const rating = require("../services/rating");
const { recoMovies } = require("../services/algoReco");
const { updateCoefs } = require("../services/setupcoef");

/**
 * returns all movies
 */
router.get("/", function (req, res) {
  MovieModel.find({}).then(function (movies) {
    res.json({ movies: movies });
  });
});

/**
 * returns the top {{ nb }} movies, ordered by the evaluations they were given
 */
router.get("/top/:nb", function (req, res) {
  MovieModel.find({})
    .sort({ average_rating: -1 })
    .limit(parseInt(req.params.nb))
    .then(function (movies) {
      res.status(201).json({ movies: movies });
    });
});

/**
 * returns a specific movie based on its id
 */
router.get("/:id", function (req, res) {
  MovieModel.find({ _id: req.params.id })
    .then(function (movie) {
      res.status(201).json({ movie: movie });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

/**
 * returns all movies of a specific genre
 */
router.get("/genre/:id", function (req, res) {
  MovieModel.find({ genre_ids: req.params.id })
    .then(function (movies) {
      res.status(201).json({ movies: movies });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

/**
 * returns movies whose title contains the query
 */
router.get("/search/:query", function (req, res) {
  MovieModel.find({ title: { $regex: req.params.query, $options: "i" } })
    .then(function (movies) {
      res.status(201).json({ movies: movies });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

/**
 * posts a new movie to add to the collection
 */
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
      updateCoefs(newDocument._id);
      res.status(201).json(newDocument);
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

/**
 * evaluates a movie. This function then updates the top movies,
 * and also updates the recommendations for the user that voted.
 */
router.post("/eval", function (req, res) {
  const movieId = req.body.movieId;
  const userId = req.body.userId;
  const evaluation = req.body.eval;
  evals
    .eval(userId, movieId, evaluation)
    .then(function (newDocument) {
      rating.average(movieId);
      recoMovies(userId).then(function (recommended) {
        console.log(recommended);
        UserModel.findOneAndUpdate(
          {
            _id: userId,
          },
          { recommendedMovies: recommended },
          { new: true }
        ).then(function () {
          res.status(201).json(newDocument);
          return;
        });
      });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

/**
 * gets the evaluation of a specific movie from a specific user
 */
router.get("/eval/:userId/:movieId", function (req, res) {
  const movieId = req.params.movieId;
  const userId = req.params.userId;
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

/**
 * adds a movie to a user's "myMovies"
 */
router.post("/mymovies/:userId/:movieId", async function (req, res) {
  const userId = req.params.userId;
  const movieId = req.params.movieId;
  try {
    const movie = await MovieModel.findOne({ _id: movieId });
    const user = await UserModel.findOne({ _id: userId });

    user.myMovies.push(movie);
    user.save();
    res.status(201).json({ message: "all good" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * gets all movies that are in the collection "myMovies" of a user
 */
router.get("/mymovies/:userId", async function (req, res) {
  const userId = req.params.userId;
  try {
    const user = await UserModel.findOne({ _id: userId }).populate("myMovies");
    console.log(user);
    res.status(201).json({ movies: user.myMovies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * removes a movie from a user's "myMovies" collection
 */
router.delete("/mymovies/:userId/:movieId", function (req, res) {
  const userId = req.params.userId;
  const movieId = req.params.movieId;
  UserModel.findOne({ _id: userId })
    .then(function (user) {
      user.myMovies.pull({ _id: movieId });
      user.save();
      res.status(201).end();
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
