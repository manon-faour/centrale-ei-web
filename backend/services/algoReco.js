const MovieModel = require("../models/movie");
const EvalModel = require("../models/eval");
const UserModel = require("../models/user");
const fs = require("fs")


const mathjs = require("mathjs");
const { setupcoef } = require("./setupcoef");
const N = 3;
const NbRecoMovies = 8;

const vectorizeMovie = async function(id_movie) {
    return new Promise(function(resolve, reject) {
        MovieModel.findById(id_movie)
    .then((movie) => {
        var vect = [];
        //Date
        if(movie.release_date) {
            vect.push(parseInt(movie.release_date.split('-')[0]));
        } else {
            vect.push(2000)
        }

        //Language
        vect.push(boolToBin('en', movie.vo));
        vect.push(boolToBin('fr', movie.vo));
        vect.push(boolToBin('ja', movie.vo));
        vect.push(boolToBin('nl', movie.vo));
        vect.push(boolToBin('ko', movie.vo));
        vect.push(boolToBin('es', movie.vo));
        vect.push(boolToBin('zh', movie.vo));

        //genres
        vect.push(boolToBinArray(28, movie.genre_ids));
        vect.push(boolToBinArray(12, movie.genre_ids));
        vect.push(boolToBinArray(16, movie.genre_ids));
        vect.push(boolToBinArray(35, movie.genre_ids));
        vect.push(boolToBinArray(80, movie.genre_ids));
        vect.push(boolToBinArray(99, movie.genre_ids));
        vect.push(boolToBinArray(18, movie.genre_ids));
        vect.push(boolToBinArray(10751, movie.genre_ids));
        vect.push(boolToBinArray(14, movie.genre_ids));
        vect.push(boolToBinArray(36, movie.genre_ids));
        vect.push(boolToBinArray(27, movie.genre_ids));
        vect.push(boolToBinArray(10402, movie.genre_ids));
        vect.push(boolToBinArray(9648, movie.genre_ids));
        vect.push(boolToBinArray(10749, movie.genre_ids));
        vect.push(boolToBinArray(878, movie.genre_ids));
        vect.push(boolToBinArray(10770, movie.genre_ids));
        vect.push(boolToBinArray(53, movie.genre_ids));
        vect.push(boolToBinArray(10752, movie.genre_ids));
        vect.push(boolToBinArray(37, movie.genre_ids));

        resolve(vect);
    })
    .catch((error) => {console.log("Error finding movie by id","message: ", error); reject();})
    });

}

const standardizationCoefficients = function () {
    console.log("Calcul des coef de standartization")
    return new Promise(function (resolve, reject) {

        MovieModel.countDocuments({}, function(err, count){
            MovieModel.find({}).exec()
            .then( async function (movies)  {
                //Average
                var sums = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

                for (var i = 0; i < movies.length; i++) {
                    const vect =  await vectorizeMovie(movies[i]);
                    vect.forEach( (value, index) => {
                        sums[index] = sums[index] + value;

                    })
                }
                for (var i = 0; i < sums.length; i++) {
                    sums[i] = sums[i] / count;
                }

                //Deviation²
                var sumsDev =  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

                for (var i = 0; i < movies.length; i++) {
                    const vect =  await vectorizeMovie(movies[i]);
                    vect.forEach( (value, index) => {
                        sumsDev[index] = (sums[index] - value)*(sums[index] - value);

                    })
                }
                for (var i = 0; i < sums.length; i++) {
                    sumsDev[i] = Math.sqrt(sumsDev[i] / count);
                }


                resolve([sums, sumsDev]);

             })
        });
    })

}

const getCoefPreCalculate = async function () {
    return new Promise((resolve, reject) => {
        fs.readFile('dataInfos.json', 'utf8', function (err, jsonString) {
            if(err) {
                setupcoef().then(async () => {
                    await getCoefPreCalculate();
                });
            }
            resolve(JSON.parse(jsonString));
        })

    })

}

const vectorizeMovieStandard = async function(id_movie) {
    return new Promise(async (resolve, reject) =>{
        var vect = await vectorizeMovie(id_movie);
        const coefs = await getCoefPreCalculate();

        for (var i = 0; i <vect.length; i++){
            vect[i] = (vect[i] - coefs[0][i])/coefs[1][i];
        }

        resolve(vect)
    });


}

const boolToBin = (value, variable) => {
    if (variable==value) {
        return 1;
    } else {
        return 0;
    }
}

const boolToBinArray = (value, array) => {
    if (array.includes(value)) {
        return 1;
    } else {
        return 0;
    }
}

const sim = (x, y) => {
    return (mathjs.dot(x,y)/(mathjs.norm(x, x.length)*mathjs.norm(y, y.length)));
}

const recoMovies = function(userId) {

    UserModel.findById(userId)
    .then(async (user) => {

        const tuple= await moviesNotedUser(user);
        const moviesNoted = tuple[0];
        const notesUser = tuple[1];
        const allMovies = await MovieModel.find({});


        var notesPredict = [];

        for (var i = 0; i < allMovies.length; i++) {
            const movie = allMovies[i];
            if (!moviesNoted.includes(movie.id)){
                const vect = await vectorizeMovieStandard(movie.id);
                const neighbors = await findNeighbors(vect, moviesNoted)
                var sumCoef=0;
                var sumAbs=0;
                for (var i = 0; i < neighbors.length; i++) {
                    sumAbs += Math.abs(neighbors[i].sim);
                    sumCoef += neighbors[i].sim*notesUser[neighbors[i].neighbor];
                }
                notesPredict.push({"id_movie": movie.id, "note": sumCoef/sumAbs})
            }
        }

        notesPredict.sort(function(a,b) {
            return (a.note) - (b.note);
        })

        var recoMovies = [];
        for (var i = 0; i < Math.min(NbRecoMovies, notesPredict.length); i++) {
            recoMovies.push(notesPredict[i].id_movie);
        }
        return recoMovies;
    })

}

const findNeighbors = (vectMovie, neighbors) => {
    return new Promise(async (resolve, reject) => {
        var simL = [];
        for (var i = 0; i < neighbors.length; i++) {
            const vect1 = await vectorizeMovieStandard(neighbors[i]);

            simL.push({
                "neighbor": neighbors[i],
                "sim": sim(vect1,vectMovie) });
        }
        simL.sort(function(a, b) {
            return (a.sim) - (b.sim);
        });

        var r=[];
        for (var i = 0; i < Math.min(N, simL.length); i++) {
            r.push(simL[i]);
        }

        resolve(r);

    })
}

const moviesNotedUser = (user) => {
    return new Promise((resolve, reject) => {
        EvalModel.find({user : user})
        .then((evals) => {
            var moviesId = [];
            var notes = {};
            evals.forEach((eval) => {
                moviesId.push(eval.movie);
                notes[eval.movie] = eval.eval;
            })
            resolve([moviesId, notes]);
        })
        .catch((err) => reject(err));
    })

}

exports.vectorizeMovie = vectorizeMovie;
exports.recoMovies = recoMovies;
exports.standardizationCoefficients = standardizationCoefficients;
exports.getCoefPreCalculate = getCoefPreCalculate;



