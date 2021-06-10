const MovieModel = require("../models/movie");
const {standardizationCoefficients, getCoefPreCalculate, vectorizeMovie} = require("./algoReco")
const fs = require("fs")


const setupcoef =  async () => {

    return new Promise((resolve, reject) => {
        standardizationCoefficients()
        .then((coef) => {
            const data = JSON.stringify(coef);
            fs.writeFileSync('dataInfos.json', data)
            resolve();
        });
    })

}

const updateCoefs =  (id_movie) => {
    return new Promise(async (resolve, reject) => {
        var coefs = await getCoefPreCalculate();
        const vect = await vectorizeMovie(id_movie);
        MovieModel.countDocuments({}, function(err, count){
            for (let i = 0; i < vect.length; i++) {
                const avg = coefs[0][i];
                const dev = coefs[1][i];

                coefs[0][i] = (avg*(count-1) + vect[i])/count;
                coefs[1][i] = (dev*(count-1) + (coefs[0][i] - vect[i])*(coefs[0][i] - vect[i]) /count);
            }

            const data = JSON.stringify(coef);
            fs.writeFileSync('dataInfos.json', data)
            resolve();

        });

    })
}

exports.setupcoef = setupcoef;
exports.updateCoefs = updateCoefs;