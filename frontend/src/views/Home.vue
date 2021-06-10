<template>
  <div class="home">
    <img alt="doge photo" src="../assets/doge.png" class="logo" />
    <h1>DogeMovies</h1>
    <h2>Top 10</h2>
    <Caroussel :movies="top10" />

    <div v-if="user_id === -1" class="login">
      <h3>Connecte-toi pour avoir accès à plus de fonctionnalités</h3>
      <div class="input-field">
        <label for="email">Entrez votre email </label>
        <input v-model="user_email" id="email" />
      </div>
      <button @click="connect">Connexion</button>
      <label>Ou bien inscris toi</label>
      <button @click="signIn">Inscription</button>
    </div>

    <div v-if="user_id !== -1" class="perso">
      <h2>Pour vous</h2>
      <Caroussel
        v-if="recommendedMovies.length > 0"
        :movies="recommendedMovies"
      />
      <p v-if="recommendedMovies.length == 0">
        Note quelques films pour qu'on puisse trouver des films qui te
        correspondent
      </p>
      <h2>Mes Films</h2>
      <Caroussel v-if="myMovies.length > 0" :movies="myMovies" />
      <p v-if="myMovies.length == 0">Aucun film dans ta liste..</p>
    </div>
  </div>
</template>

<script>
import Caroussel from "../components/Caroussel.vue";
import axios from "axios";

export default {
  name: "Home",
  created() {
    if (localStorage.user_id) {
      this.user_id = localStorage.user_id;
    }
    this.fetchTop10();
    this.fetchMyMovies(this.user_id);
    this.fetchReco(this.user_id);
  },
  data: function () {
    return {
      top10: [],
      recommendedMovies: [],
      myMovies: [],
      user_id: -1,
      user_email: "",
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
    fetchMyMovies: function (user_id) {
      if (user_id !== -1) {
        axios
          .get(
            `${process.env.VUE_APP_BACKEND_BASE_URL}/movies/mymovies/` +
              String(user_id)
          )
          .then((response) => {
            console.log("fetchMyMovies:", response.data.movies);
            this.myMovies = response.data.movies;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    fetchReco: function (user_id) {
      console.log("try to fetch reco", user_id);
      if (user_id !== -1) {
        axios
          .get(
            `${process.env.VUE_APP_BACKEND_BASE_URL}/users/recommended/` +
              String(user_id)
          )
          .then((response) => {
            console.log("fetchReco:", response.data.movies);
            this.recommendedMovies = response.data.movies;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    getId: function (user_mail) {
      axios
        .get(
          `${process.env.VUE_APP_BACKEND_BASE_URL}/users/email/` +
            String(user_mail)
        )
        .then((response) => {
          console.log("connected: ", response);
          this.user_id = response.data.user._id;
          localStorage.user_id = response.data.user._id;
          this.fetchMyMovies(this.user_id);
          this.fetchReco(this.user_id);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    connect: function () {
      this.getId(this.user_email);
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
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login > h3 {
  font-size: 2.3em;
}
.input-field {
  font-size: 1.5em;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
}
.input-field > input {
  margin: 0px 10px;
  width: 250px;
  font-size: 0.8em;
}
button {
  width: 250px;
  font-size: 1.3em;
  margin: 20px;
  background: #becfda;
  border: none;
}
button:hover {
  background: #d4e7f3;
}
</style>
