const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const AuthError = require('../errors/AuthError');
const ConflictEmailError = require('../errors/ConflictEmailError');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const ServerError = require('../errors/ServerError');

const { NODE_ENV, JWT_SECRET } = process.env;

// создаем пользователя и запишем его в БД
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Некорректные данные'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictEmailError('Указанный пользователь уже зарегистрирован'));
      } else { next(err); }
    })
    .catch(next);
};

// аутентификация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
      // отправим токен, браузер сохранит его в куках
      res.cookie('jwt', token, {
      // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ message: 'Вход выполнен' });
    })
    .catch((err) => {
      next(new AuthError(`необходимо авторизоваться: ${err.message}`));
    });
};

// возвращаем инфу о пользователе
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};
// обновляем данные пользователя
const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  return User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Некорректные данные'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictEmailError(`Указанная почта ${email} уже зарегистрирована`));
      } else {
        next(new ServerError('Ошибка на сервере'));
      }
    });
};

module.exports = {
  createUser, updateUser, login, getUser,
};
