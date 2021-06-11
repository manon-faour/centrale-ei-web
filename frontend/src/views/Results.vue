<template>
  <div class="results">
    <h2>Résultats de la recherche "{{ searchQuery }}"</h2>
    <div class="movie-results-container">
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
  name: "Results",
  components: {
    Movie,
  },
  created() {
    this.fetchResults();
  },
  data: function () {
    return {
      movies: [],
      searchQuery: this.$route.query.search,
    };
  },
  watch: {
    $route() {
      this.$router.go();
    },
  },
  methods: {
    fetchResults: function () {
      var url = "/movies/search/";
      if (this.searchQuery === "") {
        url = "/movies";
      }
      axios
        .get(`${process.env.VUE_APP_BACKEND_BASE_URL}${url}${this.searchQuery}`)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  margin-left: 10px;
}

.movie-results-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-content: space-between;
  align-items: flex-end;
}
</style>
