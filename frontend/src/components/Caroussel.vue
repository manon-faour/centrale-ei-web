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
            :key="movie._id"
            :movie="movie"
            class="movie"
          />
        </div>
        <div class="displayed-movies">
          <Movie
            v-for="movie in displayedMovies"
            :key="movie._id"
            :movie="movie"
            class="movie"
          />
        </div>
        <div class="hidden-movies">
          <Movie
            v-for="movie in nextMovies"
            :key="movie._id"
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
      moviesToDisplay: 3,
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
  computed: {
    maxTab: function () {
      return Math.ceil(this.movies.length / this.moviesToDisplay);
    },
    displayedMovies: function () {
      return this.movies.slice(
        (this.currentTab - 1) * this.moviesToDisplay,
        this.maxTab === this.currentTab
          ? this.movies.length
          : this.currentTab * this.moviesToDisplay
      );
    },
    previousMovies: function () {
      if (this.currentTab === 1) {
        return this.movies.slice((this.maxTab - 1) * this.moviesToDisplay);
      }
      return this.movies.slice(
        (this.currentTab - 2) * this.moviesToDisplay,
        (this.currentTab - 1) * this.moviesToDisplay
      );
    },
    nextMovies: function () {
      if (this.currentTab === this.maxTab) {
        return this.movies.slice(
          0,
          this.maxTab === 1 ? this.movies.length : this.moviesToDisplay
        );
      }
      return this.movies.slice(
        this.currentTab * this.moviesToDisplay,
        this.maxTab === this.currentTab + 1
          ? this.movies.length
          : this.moviesToDisplay * (this.currentTab + 1)
      );
    },
  },
  methods: {
    animationPreviousStop: function () {
      this.animation = "";
      this.animated = false;
      if (this.currentTab > 1) {
        this.currentTab -= 1;
      } else {
        this.currentTab = this.maxTab;
      }
    },

    animationNextStop: function () {
      this.animation = "";
      this.animated = false;
      if (this.currentTab < this.maxTab) {
        this.currentTab += 1;
      } else {
        this.currentTab = 1;
      }
    },

    previous: function () {
      if (this.animated) {
        return;
      }
      this.animated = true;
      this.animation = "animate-previous";
      setTimeout(this.animationPreviousStop, 1000);
    },

    next: function () {
      if (this.animated) {
        return;
      }
      this.animated = true;
      this.animation = "animate-next";
      setTimeout(this.animationNextStop, 1000);
    },

    updateMoviesToDisplay: function () {
      if (window.innerWidth < 800) {
        this.moviesToDisplay = 2;
      } else if (window.innerWidth < 1200) {
        this.moviesToDisplay = 3;
      } else {
        this.moviesToDisplay = 4;
      }
    },
  },
  created: function () {
    this.updateMoviesToDisplay();
    window.addEventListener("resize", this.updateMoviesToDisplay);
  },
  unmounted: function () {
    window.removeEventListener("resize", this.updateMoviesToDisplay);
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
  margin: 0vh 2vw;
  width: 40vw;
  min-width: 80px;
  max-width: 300px;
}

.movie-container {
  width: 70vw;
  padding: 10px 0px;
  overflow: hidden;
}

.movie-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  transform: translateX(-70vw);
}

.displayed-movies {
  display: flex;
  width: 70vw;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}

.hidden-movies {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 70vw;
  align-items: flex-start;
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
