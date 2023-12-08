const Movie = require("../models/movie.model");

async function getAllMovies(req, res) {
    const movies = await Movie.find();
    res.status(200).send(movies);
}

async function getMovieById(req, res) {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id);

        res.status(200).send(movie);
    } catch (ex) {
        res.status(404).send({
            message: "Movie id does not exist",
        });
    }
}

async function createMovie(req, res) {
    const movie = req.body;

    const createdMovie = await Movie.create(movie);

    res.status(201).send(createdMovie);
}

async function updateMovie(req, res) {
    const id = req.params.id;

    const updatedMovie = await Movie.findOneAndUpdate(
        {
            _id: id,
        },
        {
            name: req.body.name,
            description: req.body.description,
            director: req.body.director,
            posterUrl: req.body.posterUrl,
            trailerUrl: req.body.trailerUrl,
            releaseStatus: req.body.releaseStatus,
            releaseDate: req.body.releaseDate,
        }
    ).exec();

    res.send(updatedMovie);
}

async function deleteMovie(req, res) {
    const id = req.params.id;

    await Movie.findByIdAndDelete(id);

    res.send();
}

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
};
