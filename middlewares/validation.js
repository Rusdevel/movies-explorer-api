const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

// валидация изменения данных пользователя
const userValidate = celebrate({
  // валидация запроса
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// валидация создания пользователя
const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30).required(),
  }),
});

// валидация данных для входа
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// валидация создания фильма
const validateMovies = celebrate({
  body: Joi.object().keys({
    country: Joi.string().max(80).required(),
    director: Joi.string().min(2).max(50).required(),
    duration: Joi.number().required(),
    year: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(2).max(1000).required(),
    movieId: Joi.number().required(),
    image: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new Error('Ссылка некоректная');
      }
      return value;
    }),
    trailerLink: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new Error('Ссылка некоректная');
      }
      return value;
    }),
    nameRU: Joi.string().min(2).max(80).required(),
    nameEN: Joi.string().min(2).max(80).required(),
    thumbnail: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new Error('Ссылка некоректная');
      }
      return value;
    }),
  }),
});

// валидация id фильма
const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  userValidate, validateCreateUser, validateLogin, validateMovies, validateMovieId,
};
