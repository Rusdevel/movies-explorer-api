const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // убеждаемся, что он есть
  if (!req.cookies.jwt) {
    next(new AuthError('Ошибка авторизации'));
  }
  // извлечём токен и выкинем
  const token = req.cookies.jwt;
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new AuthError('Ошибка авторизации'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
