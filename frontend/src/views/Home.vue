<template>
  <div class="home">
    <img alt="doge photo" src="../assets/doge.png" class="logo" />
    <h1>DogeMovies</h1>
    <h2>Top 10</h2>
    <Caroussel :movies="recommendedMovies.slice(0, 10)" />
    <h2>Pour vous</h2>
    <Caroussel
      :movies="[
        { title: 'Youpi' },
        { title: '2' },
        { title: '3' },
        { title: '4' },
        { title: '5' },
        { title: '6' },
        { title: '7' },
        { title: '8' },
        { title: '9' },
        { title: '10' },
        { title: '11' },
        { title: '12' },
      ]"
    />
    <h2>Mes Films</h2>
    <Caroussel
      :movies="[
        { title: 'Youpi' },
        { title: '2' },
        { title: '3' },
        { title: '4' },
        { title: '5' },
        { title: '6' },
        { title: '7' },
        { title: '8' },
        { title: '9' },
        { title: '10' },
      ]"
    />
  </div>
</template>

<script>
import Caroussel from "../components/Caroussel.vue";
import axios from "axios";

export default {
  name: "Home",
  created() {
    this.fetchTop100();
  },
  data: function () {
    return {
      top100: [],
      recommendedMovies: [{ title: "coucou" }],
      myMovies: [],
    };
  },
  components: {
    Caroussel,
  },
  methods: {
    fetchTop100: function () {
      axios
        .get(`${process.env.VUE_APP_BACKEND_BASE_URL}/movies/`)
        .then((response) => {
          this.recommendedMovies = response.data.movies;
          console.log(this.recommendedMovies);
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
