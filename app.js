const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const limiter = require('./middlewares/limiter');
const NotFoundError = require('./errors/NotFoundError');

const corsAllowed = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://api.nomoreparties.co/beatfilm-movies',
];

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express(); // подключаем express

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', (err) => {
  if (err) throw err;
  console.log('Successfully connected');
});
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (corsAllowed.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.options('*', cors());

app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use(router);
app.use(errorLogger); // подключаем логгер ошибок

app.all('*', (req, res, next) => {
  next(new NotFoundError('ресурс не найден.'));
});

app.use(errors()); // ошибки от celebrate

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
