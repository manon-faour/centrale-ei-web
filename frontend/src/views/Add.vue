<template>
  <div class="signin">
    <h2>Ajouter un film</h2>
    <form>
      <label>Titre</label>
      <input v-model="title" type="text" />
      <label>Description</label>
      <textarea v-model="description" type="text" />
      <label>Date de Sortie (AAAA-MM-JJ)</label>
      <input v-model="release_date" type="text" />
      <label>Chemin de l'affiche</label>
      <input v-model="poster_path" type="text" />
      <label>Genres</label>
      <div class="genre-selector">
        <button
          v-for="genre in dictGenres"
          :key="genre.id"
          type="button"
          @click="addGenre(genre)"
          class="genre"
          :class="genres.includes(genre.id) ? 'selected' : 'not-selected'"
        >
          {{ genre.name }}
        </button>
      </div>
      <button class="submit" type="button" @click="submit">Enregistrer</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Signin",
  created() {},
  data: function () {
    return {
      title: "",
      description: "",
      poster_path: "",
      release_date: "",
      genres: [],
      dictGenres: [
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
          name: "S-F",
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
      isActive: [
        {
          id: 28,
          value: false,
        },
        {
          id: 12,
          value: false,
        },
        {
          id: 16,
          value: false,
        },
        {
          id: 35,
          value: false,
        },
        {
          id: 80,
          value: false,
        },
        {
          id: 99,
          value: false,
        },
        {
          id: 18,
          value: false,
        },
        {
          id: 10751,
          value: false,
        },
        {
          id: 14,
          value: false,
        },
        {
          id: 36,
          value: false,
        },
        {
          id: 27,
          value: false,
        },
        {
          id: 10402,
          value: false,
        },
        {
          id: 9648,
          value: false,
        },
        {
          id: 10749,
          value: false,
        },
        {
          id: 878,
          value: false,
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
  methods: {
    submit: function () {
      axios
        .post(`${process.env.VUE_APP_BACKEND_BASE_URL}/movies/new`, {
          title: this.title,
          description: this.description,
          release_date: this.release_date,
          poster_path: this.poster_path,
          genre_ids: this.genres,
          average_rating: 0,
        })
        .then((response) => {
          console.log("on submit:", response);
          window.location.href = "/details?id=" + response.data._id;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addGenre: function (genre) {
      if (this.genres.includes(genre.id)) {
        const index = this.genres.indexOf(genre.id);
        this.genres.splice(index, 1);
      } else {
        this.genres.push(genre.id);
      }
    },
  },
};
</script>

<style scoped>
.genre {
  display: flex;
  font-size: 1em;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
  transition: 0.4s;
  align-items: center;
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
input,
textarea {
  margin: 10px;
  margin-bottom: 20px;
}
textarea {
  height: 100px;
}
label {
  font-size: 1.3em;
}
button {
  margin: 10px 5px 10px 5px;
  width: 150px;
}

.selected {
  background: #407294;
}

.genre-selector {
  display: flex;
  max-width: 500px;
  flex-wrap: wrap;
}

.submit {
  margin-top: 25px;
}
</style>
