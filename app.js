const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const usersRoute = require('./routes/users');
// const movieRoute = require('./routes/movies');
// const { createUser, login } = require('./controllers/users');
// const auth = require('./middlewares/auth');
// const NotFoundError = require('./errors/NotFoundError');
const router = require('./routes/index');
const limiter = require('./middlewares/limiter');

// const { validateCreateUser, validateLogin } = require('./middlewares/validation');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express(); // подключаем express

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', (err) => {
  if (err) throw err;

  console.log('Successfully connected');
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
/*
app.all('*', (req, res, next) => {
  next(new NotFoundError('ресурс не найден.'));
});
*/
app.use(errors()); // ошибки от celebrate

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
