const axios = require('axios');
const MovieModel = require("../models/movie");


const populateDB = function (nbMovies, nb = 0, page=1) {
  console.log("populate movies...")
  var nb = 0;
  var page = 1;
  console.log("nb",nb,"page",page);
  if (nb<=nbMovies && page <=10) {

    new Promise((resolve, reject) => {
        axios
        .get(
        "https://api.themoviedb.org/3/movie/popular?api_key=522d421671cf75c2cba341597d86403a&language=fr&page="+String(page)
        )
        .then((response) => {
            page += 1;
            var moviesFetched = response.data.results;

            moviesFetched.map((movie) =>{
                const newMovie = new MovieModel({
                    title: movie.title,
                    description: movie.overview,
                    id_tmdb: movie.id,
                    release_date: movie.release_date,
                    poster_path: "https://image.tmdb.org/t/p/w342"+movie.poster_path,
                    average_rating: 0,
                    genre_ids:  movie.genre_ids,

                    });

                    newMovie
                    .save()
                    .catch(function (error) {
                        if (error.code != 11000){
                            console.log(error);
                        }
                    });
                })
            resolve(n, page);
        })
    })
    .then((n, page) => populateDB(nbMovies, n+1, page+1));
  }

};


exports.populateDB = populateDB;