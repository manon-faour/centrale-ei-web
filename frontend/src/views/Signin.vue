<template>
  <div class="signin">
    <h2>Inscription</h2>
    <form>
      <label>Mail</label>
      <input v-model="email" type="text" />
      <label>Nom</label>
      <input v-model="nom" type="text" />
      <label>Prénom</label>
      <input v-model="prenom" type="text" />
      <button type="button" @click="submit">Enregistrer</button>
    </form>
    <div v-if="emailUsed" class="error">
      Cette adress mail est déjà utilisée
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Signin",
  created() {},
  data: function () {
    return {
      prenom: "",
      npm: "",
      email: "",
      emailUsed: false,
    };
  },
  methods: {
    submit: function () {
      axios
        .post(`${process.env.VUE_APP_BACKEND_BASE_URL}/users/new`, {
          firstName: this.prenom,
          lastName: this.nom,
          email: this.email,
        })
        .then(() => {
          this.getId(this.email);
        })
        .catch((error) => {
          this.emailUsed = true;
          console.log(error);
        });
    },
    getId: function (user_mail) {
      axios
        .get(
          `${process.env.VUE_APP_BACKEND_BASE_URL}/users/email/` +
            String(user_mail)
        )
        .then((response) => {
          localStorage.user_id = response.data.user._id;
          window.location.href = "/";
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}

.signin {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  text-align: left;
  font-size: 2.3em;
  margin-top: 100px;
}
form {
  display: flex;
  flex-direction: column;
  width: 20%;
  min-width: 300px;
  margin: 50px;
}
input {
  margin: 10px;
  margin-bottom: 20px;
}
label {
  font-size: 1.3em;
}
button {
  align-self: center;
}
</style>
