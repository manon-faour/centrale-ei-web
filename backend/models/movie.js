const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  release_date: { type: String },
  poster_path: { type: String, unique: true },
  average_rating: { type: mongoose.Decimal128 },
  genre_ids: { type: [Number] },
  vo: { type: String },
});

const MovieModel = mongoose.model("MovieModel", MovieSchema, "movies");

module.exports = MovieModel;
