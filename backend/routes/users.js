const express = require("express");
const UserModel = require("../models/user");
const EvalModel = require("../models/eval");
const router = express.Router();

/**
 * returns all users
 */
router.get("/", function (req, res) {
  UserModel.find({})
    .then(function (users) {
      res.status(201).json({ users: users });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

/**
 * returns a specific user based on their email address
 */
router.get("/:email", function (req, res) {
  if (req.params.email === "-1") {
    res.status(201).json({ user: { _id: "-1" } });
  }
  UserModel.findOne({ email: req.params.email })
    .then(function (user) {
      res.status(201).json({ user: user });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

/**
 * gets all recommended movies of a user
 */
router.get("/recommended/:id", function (req, res) {
  UserModel.find({ _id: req.params.id })
    .populate("recommendedMovies")
    .then(function (user) {
      res.status(201).json({ movies: user.recommendedMovies });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

/**
 * creates a new user
 */
router.post("/new", function (req, res) {
  const newUser = new UserModel({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  });

  newUser
    .save()
    .then(function (newDocument) {
      res.status(201).json(newDocument);
    })
    .catch(function (err) {
      if (err.code === 11000) {
        res.status(400).json({
          message: `User with email "${newUser.email}" already exists`,
        });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
});

/**
 * deletes a user and all of the evaluations that they gave
 */
router.delete("/:id", function (req, res) {
  UserModel.findById(req.params.id)
    .then(function (user) {
      EvalModel.deleteMany({ user: req.params.id }).then(function () {
        console.log(user);
        user.delete();
        res.status(201).end();
      });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
