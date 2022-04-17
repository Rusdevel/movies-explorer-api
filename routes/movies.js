const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovies, validateMovieId } = require('../middlewares/validation');

// получаем фильмы
router.get('/movies', getMovies);
// создание фильма
router.post('/movies', validateMovies, createMovie);

// удаление фильма
router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;
