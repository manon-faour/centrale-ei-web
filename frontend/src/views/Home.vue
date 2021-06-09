<template>
  <div class="home">
    <img alt="doge photo" src="../assets/doge.png" class="logo" />
    <h1>DogeMovies</h1>
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
  </div>
</template>

<script>
import Caroussel from "../components/Caroussel.vue";

export default {
  name: "Home",
  components: {
    Caroussel,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

.logo {
  height: 200px;
}
</style>
