const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const jsonErrorHandler = require("./services/jsonErrorHandler");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");
const routeNotFoundJsonHandler = require("./services/routeNotFoundJsonHandler");
const { populateDB } = require("./services/populateDB");
const {
  vectorizeMovieStandard,
  recoMovies,
  getCoefPreCalculate,
  sim,
} = require("./services/algoReco");
const { setupcoef } = require("./services/setupcoef");

const SETUPCOEF = false;
const POPULATE = false;

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(jsonErrorHandler);

app.use("/api/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/movies", moviesRouter);
app.use(routeNotFoundJsonHandler);

if (POPULATE) {
  populateDB(20, 1);
  setupcoef();
}

const test = [{id:"1", value:"3"}, {id:"1", value:"2"}]
test.sort(function(a, b) {
  return parseInt(a.value) - parseInt(b.value);
})
console.log(test);

const port = parseInt(process.env.PORT || "3000");
if (SETUPCOEF) {
  setupcoef().then(() => {
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  });
} else {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
