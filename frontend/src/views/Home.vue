<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>Welcome to Doge Movies</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Home",
  created() {
    this.fetchTop100();
  },
  data: function () {
    return {
      top100: [],
      recommendedMovies: [],
      myMovies: [],
    };
  },
  methods: {
    fetchTop100: function () {
      axios
        .get(`${process.env.VUE_APP_BACKEND_BASE_URL}/movies`)
        .then((response) => {
          this.recommendedMovies = response.data.movies;
          console.log(this.movies);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  text-align: center;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
