const router = require('express').Router();
const { userValidate } = require('../middlewares/validation');
const {
  updateUser, getUser,
} = require('../controllers/users');

// получить данные пользователя
router.get('/users/me', getUser);

// изменение данных пользователя
router.patch('/users/me', userValidate, updateUser);

module.exports = router;
