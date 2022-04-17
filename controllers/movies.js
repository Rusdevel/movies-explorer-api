const Movie = require('../models/movie');
const RequestError = require('../errors/RequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// показать все фильмы
const getMovies = (req, res, next) => {
  const owner = req.user._id;
  // console.log('owner', owner);
  Movie.find({ owner })
    .then((movies) => {
      // console.log('movies', movies);
      res.status(200)
        .send(movies);
    })
    .catch(next);
};
// создаем фильм
const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.nameRU === 'ValidationError') {
        next(new RequestError(
          'Переданы некорректные данные в методы создания фильма',
        ));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// удаляет карточку по идентификатору
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => next(new NotFoundError('Фильм с указанным id не найден')))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Нет прав для удаления фильма'));
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((movieId) => {
          if (!movieId) {
            next(new NotFoundError('Фильм не найдена'));
          }
          return res.status(200).send({ message: 'фильм удален' });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new RequestError('Переданы некорректные данные'));
          } else {
            next(err);
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
