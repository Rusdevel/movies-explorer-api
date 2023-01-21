const router = require('express').Router();

const usersRoute = require('./users');
const movieRoute = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');

const NotFoundError = require('../errors/NotFoundError');

// аутентификация пользователя
router.post('/signin', validateLogin, login);

router.post('/signout', logout);
// создание пользователя
router.post('/signup', validateCreateUser, createUser);
// авторизация
router.use(auth);
router.use('/', usersRoute);
router.use('/', movieRoute);

router.all('*', (req, res, next) => {
  next(new NotFoundError('ресурс не найден.'));
});

module.exports = router;
