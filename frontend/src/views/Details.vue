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
        <div class="star" v-on:click="onVote(1)">
          <img v-bind:src="'../assets/doge.svg'" alt="" />
        </div>
        <div class="star" v-on:click="onVote(2)">
          <img
            v-bind:src="
              '../assets/star-' + (vote >= 2 ? 'fill' : 'empty') + '.svg'
            "
            alt=""
          />
        </div>
        <div class="star" v-on:click="onVote(3)">
          <img
            src="
              '../assets/star-' + (vote >= 3 ? 'fill' : 'empty') + '.svg'
            "
            alt=""
          />
        </div>
        <div class="star" v-on:click="onVote(4)">
          <img
            v-bind:src="
              '../assets/star-' + (vote >= 4 ? 'fill' : 'empty') + '.svg'
            "
            alt=""
          />
        </div>
        <div class="star" v-on:click="onVote(5)">
          <img
            v-bind:src="
              '../assets/star-' + (vote >= 5 ? 'fill' : 'empty') + '.svg'
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
  },
  data: function () {
    return {
      vote: 0,
      movie: {},
      loaded: false,
    };
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
    onVote: function (value) {
      this.vote = value;
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
</style>
