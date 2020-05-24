const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUsers, getUsersByID, updateUser, updateAvatar,
} = require('../controllers/users');

router.get(
  '/users/:id',
  celebrate({
    body: Joi.object()
      .keys({
        id: Joi.string().alphanum().length(24),
      }),
    // .unknown(true),
  }),
  getUsersByID,
);
router.get('/users', getUsers);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30),
        // email: Joi.string().min(2).max(30),
      })
      .unknown(true),
  }),
  updateUser,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string()
          .required()
          .custom((value, helpers) => {
            if (!validator.isURL(value)) {
              return helpers.message('avatar is not url');
            }
            return value;
          }),
      })
      .unknown(true),
  }),
  updateAvatar,
);

module.exports = router;
