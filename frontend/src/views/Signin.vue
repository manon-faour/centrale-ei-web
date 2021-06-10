<template>
  <div class="signin">
    <form>
      <label>Mail</label>
      <input v-model="email" type="text" />
      <label>Nom</label>
      <input v-model="nom" type="text" />
      <label>Prénom</label>
      <input v-model="prenom" type="text" />
      <button @click="submit">Enregistrer</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  created() {},
  data: function () {
    return {
      prenom: "",
      npm: "",
      email: "",
    };
  },
  methods: {
    submit: function () {
      console.log({
        firstName: this.prenom,
        lastName: this.nom,
        email: this.email,
      });
      axios
        .post(`${process.env.VUE_APP_BACKEND_BASE_URL}/users/new/`, {
          firstName: this.prenom,
          lastName: this.nom,
          email: this.email,
        })
        .then((response) => {
          console.log("on submit:", response);
          window.location.href = process.env.VUE_APP_FRONTEND_BASE_URL;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>
