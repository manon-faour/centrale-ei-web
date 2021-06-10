<template>
  <div class="detail">
    <img
      class="poster"
      v-bind:src="movie.poster_path"
      v-bind:alt="movie.title"
    />
    <div class="infos">
      <h2>{{ movie.title }}</h2>
      <p>Sorti le {{ movie.release_date }}</p>
      <p>{{ movie.description }}</p>
      <p>
        Note moyenne:
        {{ loaded ? movie.average_rating.$numberDecimal : "Chargement..." }}
      </p>

      <div class="stars">
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
    this.fetchUserVote();
  },
  data: function () {
    return {
      userVote: 0,
      displayedVote: 0,
      movie: {},
      loaded: false,
    };
  },
  watch: {
    userVote: function (newVote) {
      this.displayedVote = newVote;
      console.log(this.newVote);
    },
  },
  methods: {
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
          `${process.env.VUE_APP_BACKEND_BASE_URL}/movies/eval/60c0b549e9dad9aa14ca54c3/${this.$route.query.id}`
        )
        .then((response) => {
          this.userVote = response.data.eval;
          this.displayedVote = response.data.eval;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onVote: function (value) {
      this.userVote = value;
      console.log(this.vote);
    },
  },
};
</script>

<style scoped>
.detail {
  display: flex;
  margin: 50px;
}

.infos {
  display: flex;
  flex-direction: column;
  width: 30%;
  text-align: justify;
}

.poster {
  border-radius: 10px;
  margin: 50px;
}
img {
  width: 50px;
  height: 50px;
  margin: 5px;
}
.stars {
  display: flex;
  flex-direction: row;
}
</style>
