const express = require("express");
const UserModel = require("../models/user");
const EvalModel = require("../models/eval");
const router = express.Router();

router.get("/", function (req, res) {
  UserModel.find({})
    .then(function (users) {
      res.status(201).json({ users: users });
    })
    .catch(function (err) {
      res.status(500).json({ message: err.message });
    });
});

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
