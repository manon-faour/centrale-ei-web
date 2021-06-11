<template>
  <div class="detail">
    <img
      class="poster"
      v-bind:src="movie.poster_path"
      v-bind:alt="movie.title"
    />
    <div class="infos">
      <h2>{{ movie.title }}</h2>
      <div class="genres">
        <div
          class="genre"
          v-on:click="redirectGenre(genre_id)"
          v-for="genre_id in movie.genre_ids"
          v-bind:key="genre_id"
        >
          {{ genres.filter((genre) => genre.id === genre_id)[0].name }}
        </div>
      </div>
      <p class="date">
        Sorti le
        {{ date }}
      </p>
      <p class="description">{{ movie.description }}</p>
      <p class="rating">
        <span :class="color">
          {{ note }}
        </span>
      </p>
      <button class="add" v-if="connected && !added" v-on:click="addMovie">
        <div class="add-text">Ajouter à mes films</div>
      </button>
      <button class="remove" v-if="connected && added" v-on:click="removeMovie">
        <div class="remove-text">Supprimer de mes films</div>
      </button>
      <div v-if="connected" class="stars">
        <div
          class="star"
          v-on:click="onVote(1)"
          @mouseover="displayedVote = 1"
          @mouseleave="displayedVote = userVote"
        >
          <img
            :src="
              require('../assets/star-' +
                (displayedVote >= 1 ? 'fill' : 'empty') +
                '.svg')
            "
            alt=""
          />
        </div>
        <div
          class="star"
          v-on:click="onVote(2)"
          @mouseover="displayedVote = 2"
          @mouseleave="displayedVote = userVote"
        >
          <img
            :src="
              require('../assets/star-' +
                (displayedVote >= 2 ? 'fill' : 'empty') +
                '.svg')
            "
            alt=""
          />
        </div>
        <div
          class="star"
          v-on:click="onVote(3)"
          @mouseover="displayedVote = 3"
          @mouseleave="displayedVote = userVote"
        >
          <img
            :src="
              require('../assets/star-' +
                (displayedVote >= 3 ? 'fill' : 'empty') +
                '.svg')
            "
            alt=""
          />
        </div>
        <div
          class="star"
          v-on:click="onVote(4)"
          @mouseover="displayedVote = 4"
          @mouseleave="displayedVote = userVote"
        >
          <img
            :src="
              require('../assets/star-' +
                (displayedVote >= 4 ? 'fill' : 'empty') +
                '.svg')
            "
            alt=""
          />
        </div>
        <div
          class="star"
          v-on:click="onVote(5)"
          @mouseover="displayedVote = 5"
          @mouseleave="displayedVote = userVote"
        >
          <img
            :src="
              require('../assets/star-' +
                (displayedVote >= 5 ? 'fill' : 'empty') +
                '.svg')
            "
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  created() {
    this.fetchMovie();
    if (localStorage.user_id) {
      this.user_id = localStorage.user_id;
      this.connected = true;
      this.fetchUserVote();
      this.fetchAdded();
    }
  },
  data: function () {
    return {
      userVote: 0,
      displayedVote: 0,
      movie: {},
      loaded: false,
      user_id: -1,
      connected: false,
      added: false,
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
  computed: {
    color: function () {
      if (!this.loaded || this.movie.average_rating.$numberDecimal < 1) {
        return "text";
      }
      if (this.movie.average_rating.$numberDecimal < 2) {
        return "red";
      }
      if (this.movie.average_rating.$numberDecimal < 3) {
        return "orange";
      }
      if (this.movie.average_rating.$numberDecimal < 4) {
        return "yellow";
      }

      return "green";
    },
    date: function () {
      if (!this.loaded) {
        return "";
      }
      return new Date(this.movie.release_date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    note: function () {
      if (this.loaded) {
        const noteRound =
          Math.round(this.movie.average_rating.$numberDecimal * 10) / 10;
        if (noteRound === 0) {
          return "Pas de note pour ce film";
        }
        return noteRound + " / 5";
      }
      return "Chargement...";
    },
  },
  watch: {
    userVote: function (newVote) {
      this.displayedVote = newVote;
      console.log(this.newVote);
    },
  },
  methods: {
    redirectGenre: function (genre_id) {
      this.$router.push({
        name: "Genres",
        query: { genres: genre_id },
      });
    },
    fetchMovie: function () {
      axios
        .get(
          `${process.env.VUE_APP_BACKEND_BASE_URL}/movies/${this.$route.query.id}`
        )
        .then((response) => {
          this.movie = response.data.movie[0];
          this.loaded = true;
          console.log(this.movie);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchUserVote: function () {
      axios
        .get(
          `${process.env.VUE_APP_BACKEND_BASE_URL}/movies/eval/${this.user_id}/${this.$route.query.id}`
        )
        .then((response) => {
          this.userVote = response.data.eval;
          this.displayedVote = response.data.eval;
          console.log(this.userVote);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onVote: function (value) {
      this.userVote = value;
      axios.post(`${process.env.VUE_APP_BACKEND_BASE_URL}/movies/eval`, {
        movieId: this.movie._id,
        userId: this.user_id,
        eval: this.userVote,
      });
      setTimeout(this.fetchMovie, 300);
    },
    addMovie: function () {
      axios
        .post(
          `${process.env.VUE_APP_BACKEND_BASE_URL}/movies/mymovies/${this.user_id}/${this.movie._id}`,
          {}
        )
        .then((this.added = !this.added))
        .catch((error) => {
          console.log(error);
        });
    },
    removeMovie: function () {
      axios
        .delete(
          `${process.env.VUE_APP_BACKEND_BASE_URL}/movies/mymovies/${this.user_id}/${this.movie._id}`,
          {}
        )
        .then((this.added = !this.added))
        .catch((error) => {
          console.log(error);
        });
    },
    fetchAdded: function () {
      axios
        .get(
          `${process.env.VUE_APP_BACKEND_BASE_URL}/movies/mymovies/${this.user_id}`
        )
        .then((response) => {
          this.added = response.data.movies
            .map((movie) => movie._id)
            .includes(this.$route.query.id);
          console.log(response.data.movie);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.detail {
  display: flex;
  align-items: flex-start;
  margin: 50px;
}

.infos {
  display: flex;
  flex-direction: column;
  width: 30%;
  margin: 30px;
  text-align: justify;
}

.poster {
  border-radius: 10px;
  margin: 50px;
}
.star > img {
  width: 50px;
  height: 50px;
  margin: 5px;
}
.stars {
  display: flex;
  align-self: center;
  flex-direction: row;
}
.rating {
  font-size: 2.3em;
  font-weight: bold;
}
.green {
  color: green;
}
.orange {
  color: orange;
}
.yellow {
  color: rgb(224, 191, 0);
}
.red {
  color: red;
}
.text {
  font-size: 0.6em;
}
.genres {
  display: flex;
  flex-direction: row;
}
.genre {
  font-size: 1em;
  border-radius: 10px;
  background: rgb(172, 172, 172);
  padding: 5px;
  margin: 5px;
  transition: 0.4s;
}
.genre:hover {
  background: rgb(209, 209, 209);
}
button {
  width: 250px;
  padding: 10px;
  margin: 20px 0px;
}
.add {
  background: #48acf0;
}
.add:hover {
  background: #70bef3;
}
.remove {
  background: rgb(187, 187, 187);
}
.remove:hover {
  background: rgb(221, 221, 221);
}
</style>
