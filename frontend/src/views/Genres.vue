<template>
  <div class="genre-page">
    <h2>Recherche par genre</h2>
    <div class="genres">
      <div
        class="genre"
        :class="
          selected_genres.includes(genre.id) ? 'selected' : 'not-selected'
        "
        v-for="genre in genres"
        v-bind:key="genre.id"
        v-on:click="handleClick(genre.id)"
      >
        {{ genre.name }}
      </div>
    </div>
    <div class="movie-results">
      <p v-if="!movies.length">Il n'y pas de film de ce nom</p>
      <Movie
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        class="movie"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Movie from "../components/Movie.vue";

export default {
  name: "Genres",
  components: {
    Movie,
  },
  created() {
    this.fetchResults();
  },
  data: function () {
    return {
      selected_genres: this.$route.query.genres
        ? this.$route.query.genres.split("-").map(function (item) {
            return parseInt(item, 10);
          })
        : [],
      movies: [],
      genres: [
        {
          id: 28,
          name: "Action",
        },
        {
          id: 12,
          name: "Adventure",
        },
        {
          id: 16,
          name: "Animation",
        },
        {
          id: 35,
          name: "Comedy",
        },
        {
          id: 80,
          name: "Crime",
        },
        {
          id: 99,
          name: "Documentary",
        },
        {
          id: 18,
          name: "Drama",
        },
        {
          id: 10751,
          name: "Family",
        },
        {
          id: 14,
          name: "Fantasy",
        },
        {
          id: 36,
          name: "History",
        },
        {
          id: 27,
          name: "Horror",
        },
        {
          id: 10402,
          name: "Music",
        },
        {
          id: 9648,
          name: "Mystery",
        },
        {
          id: 10749,
          name: "Romance",
        },
        {
          id: 878,
          name: "Science Fiction",
        },
        {
          id: 10770,
          name: "TV Movie",
        },
        {
          id: 53,
          name: "Thriller",
        },
        {
          id: 10752,
          name: "War",
        },
        {
          id: 37,
          name: "Western",
        },
      ],
    };
  },
  methods: {
    handleClick: function (genre_id) {
      if (this.selected_genres.includes(genre_id)) {
        this.selected_genres.splice(this.selected_genres.indexOf(genre_id), 1);
      } else {
        this.selected_genres.push(genre_id);
      }
      this.fetchResults();
    },
    fetchResults: function () {
      var url = "/movies/search/genre/";
      var genre_ids = "";
      this.selected_genres.forEach((genre_id) => {
        genre_ids = genre_ids + genre_id.toString() + "-";
      });
      genre_ids = genre_ids.substring(0, genre_ids.length - 1);
      if (genre_ids === "") {
        url = "/movies";
      }
      axios
        .get(`${process.env.VUE_APP_BACKEND_BASE_URL}${url}${genre_ids}`)
        .then((response) => {
          // Do something if call succeeded
          this.movies = response.data.movies;
        })
        .catch((error) => {
          // Do something if call failed
          console.log(error);
        });
    },
  },
};
</script>

<style>
.genres {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.not-selected {
  background: rgb(209, 209, 209);
}

.not-selected:hover {
  background: rgb(148, 145, 145);
}

.selected {
  background: rgb(148, 145, 145);
}

.selected:hover {
  background: rgb(209, 209, 209);
}

.genre {
  display: flex;
  font-size: 1em;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
  transition: 0.4s;
  align-items: center;
}

.movie-results {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-content: space-between;
  align-items: flex-end;
}
</style>
