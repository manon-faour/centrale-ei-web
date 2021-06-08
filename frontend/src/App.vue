<template>
  <nav>
    <router-link class="nav-link" to="/"><img src="./assets/doge.png" alt="doge photo" class="logo"></router-link>
    <div class="searchbar">
      <img src="./assets/search.svg" alt="search icon" class="search-logo">
      <input v-model="searchText" type="text" @keyup.enter="search" class="search-input" placeholder="Rechercher...">
    </div>
  </nav>
  <router-view />
</template>

<script>
export default {
  name: "navbar",
  data: function () {
    return {
      searchText: "",
    };
  },
  methods: {
    search: function () {
      console.log(this.searchText);
    }
  }
};
</script>


<style scoped>
nav {
  width: 100%;
  height: 70px;
  background: #3D5A6C;
  display: flex;
  align-items: center;
  justify-content: flex;
}

@keyframes wiggle {
  0% {transform: rotate(0deg);}
  25% {transform: rotate(-30deg);}
  50% {transform: rotate(30deg);}
  75% {transform: rotate(-30deg);}
  100% {transform: rotate(0deg);}
}

.logo {
  height: 50px;
  margin-left: 15px;
  margin-right: 15px;
}

.logo:hover {
  animation-name: wiggle;
  animation-duration: 0.4s;
}

.searchbar {
  background: #BECFDA;
  width: 40%;
  display: flex;
  height: 45px;
  border-radius: 10px;
  align-items: center;
  margin-left: 25%;
}

.search-input {
  width: 100%;
  border: 0px;
  background: transparent;
  margin-left: 5px;
}

.search-input:focus {
  outline: none;
}

.search-logo {
  height: 45px;
  margin-bottom: 5px;
  margin-left: 5px;
  fill: white;
}

</style>
