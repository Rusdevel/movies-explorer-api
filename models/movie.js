const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String, // имя — это строка
    required: true,
  },
  duration: {
    type: Number, // имя — это строка
    required: true,
  },
  director: {
    type: String, // имя — это строка
    required: true,
  },
  year: {
    type: String, // имя — это строка
    required: true,
  },
  description: {
    type: String, // имя — это строка
    required: true,
  },
  // ссылка на постер к фильму
  image: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value, { require_protocol: true });
      },
      message: 'Ссылка некоректная',
    },
  },
  // ссылка на трейлер фильма
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value, { require_protocol: true });
      },
      message: 'Ссылка некоректная',
    },
  },
  // миниатюрное изображение постера к фильму
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value, { require_protocol: true });
      },
      message: 'Ссылка некоректная',
    },
  },

  // _id пользователя, который сохранил фильм
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  // id фильма, который содержится в ответе сервиса MoviesExplorer
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  nameEN: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },

});
module.exports = mongoose.model('movie', movieSchema);
