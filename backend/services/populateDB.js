const axios = require("axios");
const MovieModel = require("../models/movie");

const populateDB = function (pageMax, page) {
  if (page <= pageMax) {
    const fetchPage = function (page, resolve) {
      axios
        .get(
          "https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&language=fr&page=" +
            String(page)
        )
        .then((response) => {
          var moviesFetched = response.data.results;

          moviesFetched.map((movie) => {
            const newMovie = new MovieModel({
              title: movie.title,
              description: movie.overview,
              id_tmdb: movie.id,
              release_date: movie.release_date,
              poster_path:
                "https://image.tmdb.org/t/p/w342" + movie.poster_path,
              average_rating: 0,
              genre_ids: movie.genre_ids,
              vo: movie.original_language,
            });

            newMovie
              .save()
              .then()
              .catch(function (error) {
                if (error.code != 11000) {
                  console.log(error);
                } else {
                  console.log("Déja là: ", movie.title);
                }
              });
          });
          resolve(page);
        });
    };

    // eslint-disable-next-line no-undef
    new Promise((resolve) => {
      fetchPage(page, resolve);
    }).then((page) => {
      const newPage = page + 1;
      populateDB(pageMax, newPage);
    });
  }
};

exports.populateDB = populateDB;
