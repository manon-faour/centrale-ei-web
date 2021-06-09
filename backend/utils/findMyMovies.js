const UserModel = require("../models/user");

const findMyMovies = function (req) {
  UserModel.findOne({ email: req.body.email })
    .populate("myMovies")
    .exec(function (err, user) {
      if (err) console.log(err);
      console.log(user.myMovies);
    });
};

exports.findMyMovies = findMyMovies;
