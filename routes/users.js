const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUsersByID, updateUser, updateAvatar,
} = require('../controllers/users');

router.get(
  '/users/:id',
  celebrate({
    body: Joi.object()
      .keys({
        id: Joi.string().alphanum().length(24),
      })
      .unknown(true),
  }),
  getUsersByID,
);
router.get('/users', getUsers);

router.patch(
  '/users/:id',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().min(2).max(30),
        // email: Joi.string().min(2).max(30),
      })
      .unknown(true),
  }),
  updateUser,
);

router.patch(
  '/users/:id/:avatar',
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string().regex(
          /http(s)?:\/\/?(([0-9]{0,3}\.[0-5]{0,3}\.[0-5]{0,3}\.)([0-2]?[0-5]?[0-5]?)|(www.)?\w+(\.|\/)+[A-Za-z]{2,})(:6[0-5]{1,4})?(:[1-5][0-9]{1,4}|:[0-9]{2,4})?#?/,
        ),
      })
      .unknown(true),
  }),
  updateAvatar,
);

module.exports = router;
