<template>
  <div class="caroussel">
    <img
      src="../assets/arrow.svg"
      alt="left arrow"
      class="left arrow"
      v-on:click="previous"
    />
    <div class="movie-container">
      <div v-bind:class="'movie-list ' + animation">
        <div class="hidden-movies">
          <Movie
            v-for="movie in previousMovies"
            :key="movie.title"
            :movie="movie"
            class="movie"
          />
        </div>
        <div class="displayed-movies">
          <Movie
            v-for="movie in displayedMovies"
            :key="movie.title"
            :movie="movie"
            class="movie"
          />
        </div>
        <div class="hidden-movies">
          <Movie
            v-for="movie in nextMovies"
            :key="movie.title"
            :movie="movie"
            class="movie"
          />
        </div>
      </div>
    </div>
    <img
      src="../assets/arrow.svg"
      alt="right arrow"
      class="right arrow"
      v-on:click="next"
    />
  </div>
</template>

<script>
import Movie from "./Movie.vue";

export default {
  name: "Caroussel",
  data: function () {
    return {
      currentTab: 1,
      moviesToDisplay: 5,
      maxTab: 1, // Nombre d'onglets à afficher
      displayedMovies: [],
      previousMovies: [],
      nextMovies: [],
      animation: "",
      animated: false,
    };
  },
  props: {
    movies: Array,
  },
  components: {
    Movie,
  },
  methods: {
    previousDisplay: function () {
      this.animation = "";
      this.nextMovies = this.displayedMovies;
      this.displayedMovies = this.previousMovies;
      if (this.currentTab === 1) {
        this.previousMovies = this.movies.slice(
          (this.maxTab - 1) * this.moviesToDisplay
        );
      } else {
        this.previousMovies = this.movies.slice(
          (this.currentTab - 2) * this.moviesToDisplay,
          (this.currentTab - 1) * this.moviesToDisplay
        );
      }
      this.animated = false;
    },

    previous: function () {
      if (this.animated) {
        return;
      }
      this.animated = true;
      if (this.currentTab > 1) {
        this.currentTab -= 1;
      } else {
        this.currentTab = this.maxTab;
      }
      this.animation = "animate-previous";
      setTimeout(this.previousDisplay, 1000);
    },

    nextDisplay: function () {
      this.animation = "";
      this.previousMovies = this.displayedMovies;
      this.displayedMovies = this.nextMovies;
      if (this.currentTab === this.maxTab) {
        this.nextMovies = this.movies.slice(
          0,
          this.maxTab === 1 ? this.movies.length : this.moviesToDisplay
        );
      } else {
        this.nextMovies = this.movies.slice(
          this.currentTab * this.moviesToDisplay,
          this.maxTab - 1 === this.currentTab
            ? this.movies.length
            : this.moviesToDisplay * (this.currentTab + 1)
        );
      }
      this.animated = false;
    },

    next: function () {
      if (this.animated) {
        return;
      }
      this.animated = true;
      if (this.currentTab < this.maxTab) {
        this.currentTab += 1;
      } else {
        this.currentTab = 1;
      }
      this.animation = "animate-next";
      setTimeout(this.nextDisplay, 1000);
    },
  },
  created: function () {
    this.maxTab = Math.ceil(this.movies.length / this.moviesToDisplay);
    this.displayedMovies = this.movies.slice(0, this.moviesToDisplay);
    this.previousMovies = this.movies.slice(
      (this.maxTab - 1) * this.moviesToDisplay
    );
    switch (this.maxTab) {
      case 1:
        this.nextMovies = this.movies;
        break;
      case 2:
        this.nextMovies = this.movies.slice(this.moviesToDisplay);
        break;
      default:
        this.nextMovies = this.movies.slice(
          this.moviesToDisplay,
          2 * this.moviesToDisplay
        );
    }
  },
};
</script>

<style scoped>
.caroussel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.movie {
  transition: 0.4s ease-in-out;
  margin: 0px 25px;
}

.movie-container {
  width: 1500px;
  padding: 10px 0px;
  overflow: hidden;
}

.movie-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  transform: translateX(-1500px);
}

.displayed-movies {
  display: flex;
  flex-direction: row;
  justify-content: center;
  min-width: 1500px;
}

.hidden-movies {
  display: flex;
  flex-direction: row;
  justify-content: center;
  min-width: 1500px;
}

@keyframes next {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(-200%);
  }
}

@keyframes previous {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0px);
  }
}

.animate-next {
  animation: next;
  animation-duration: 1s;
}

.animate-previous {
  animation: previous;
  animation-duration: 1s;
}

.arrow {
  width: 50px;
  height: 50px;
  transition: transform 0.2s ease-in-out;
}

.right:hover {
  transform: scale(1.2);
}

.left {
  transform: scale(-1, 1);
}

.left:hover {
  transform: scale(-1.2, 1.2);
}
</style>
