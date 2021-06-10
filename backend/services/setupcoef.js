const MovieModel = require("../models/movie");
const {
  standardizationCoefficients,
  getCoefPreCalculate,
  vectorizeMovie,
} = require("./algoReco");
const fs = require("fs");

/**
 * First calculates coefs of movies based on the recommandation algorithm.
 * Writes the coefficients in a json file in the folder backend.
 */
const setupcoef = async () => {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => {
    standardizationCoefficients().then((coef) => {
      const data = JSON.stringify(coef);
      fs.writeFileSync("dataInfos.json", data);
      resolve();
    });
  });
};

/**
 * updates the coefficients, called when a new movie is added
 */
const updateCoefs = (id_movie) => {
  // eslint-disable-next-line no-undef
  return new Promise(async (resolve) => {
    var coefs = await getCoefPreCalculate();
    const vect = await vectorizeMovie(id_movie);
    MovieModel.countDocuments({}, function (err, count) {
      for (let i = 0; i < vect.length; i++) {
        const avg = coefs[0][i];
        const dev = coefs[1][i];

        coefs[0][i] = (avg * (count - 1) + vect[i]) / count;
        coefs[1][i] =
          dev * (count - 1) +
          ((coefs[0][i] - vect[i]) * (coefs[0][i] - vect[i])) / count;
      }

      const data = JSON.stringify(coefs);
      fs.writeFileSync("dataInfos.json", data);
      resolve();
    });
  });
};

exports.setupcoef = setupcoef;
exports.updateCoefs = updateCoefs;
