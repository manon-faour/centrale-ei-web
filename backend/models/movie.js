const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: { type: String},
  description: {type: String},
  id_tmdb: {type: Number, required: true, unique: true},
  release_date: {type: String},
  poster_path: {type: String},
  average_rating: {type: mongoose.Decimal128},
  genre_ids:  {type: [Number]}

});

const MovieModel = mongoose.model("MovieModel", MovieSchema, "movies");

module.exports = MovieModel;
