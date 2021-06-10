<template>
  <div class="home">
    <img alt="doge photo" src="../assets/doge.png" class="logo" />
    <h1>DogeMovies</h1>
    <h2>Top 10</h2>
    <Caroussel :movies="top10" />
    <!--     <h2>Pour vous</h2>
    <Caroussel :movies="" /> -->
    <h2>Mes Films</h2>
    <Caroussel :movies="myMovies" />
  </div>
</template>

<script>
import Caroussel from "../components/Caroussel.vue";
import axios from "axios";

export default {
  name: "Home",
  created() {
    this.fetchTop10();
    this.fetchMyMovies();
  },
  data: function () {
    return {
      top10: [],
      recommendedMovies: [],
      myMovies: [],
    };
  },
  components: {
    Caroussel,
  },
  methods: {
    fetchTop10: function () {
      axios
        .get(`${process.env.VUE_APP_BACKEND_BASE_URL}/movies/top/10`)
        .then((response) => {
          this.top10 = response.data.movies;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchMyMovies: function () {
      axios
        .get(`${process.env.VUE_APP_BACKEND_BASE_URL}/movies/mymovies`)
        .then((response) => {
          this.myMovies = response.data.movies;
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
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 3em;
}

.logo {
  height: 200px;
}

@keyframes wiggle {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-30deg);
  }
  50% {
    transform: rotate(30deg);
  }
  75% {
    transform: rotate(-30deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.logo:hover {
  animation-name: wiggle;
  animation-duration: 0.4s;
}

h2 {
  text-align: left;
  margin-left: 10%;
  font-size: 2.3em;
  margin-top: 100px;
}
</style>
