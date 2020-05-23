const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/users');
// const { BadRequestError } = require('../constructorError/error');
const { BadAuthenticationError } = require('../constructorError/error');
const { IdNotFoundError } = require('../constructorError/error');


const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
  // .catch(() => {
  //   const err = new BadRequestError(
  //     `Пользователя с id: ${req.params.id} не существует`,
  //   );
  //   return next(err);
  // });
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  if (req.body.password.length <= 8) {
    return res
      .status(404)
      .send({ message: 'Пароль должен быть более 8 символов' });
  }
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    user
      .create({
        name,
        about,
        email,
        password: hash,
        avatar,
      })
      .then((newUser) => user.findOne({ _id: newUser._id }))
      .then((newUser) => res.status(200).send(newUser))
      .catch(next);
    // .catch(() => {
    //   const err = new BadRequestError(
    //     'Не удалось создать пользователя.',
    //   );
    //   return next(err);
    // });
  });
};

module.exports.getUsersByID = (req, res, next) => {
  user
    .findById(req.params.id)
    .then((userbyID) => {
      if (userbyID) {
        res.send({ data: userbyID });
      } else {
        const err = new IdNotFoundError(
          `Пользователя с id: ${req.params.id} не существует`,
        );
        return next(err);
      }
      return userbyID;
    })
    .catch(next);
};

//
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(
      req.params.id,
      {
        name,
        about,
      },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true, // если пользователь не найден, он будет создан
      },
    )
    .then((updUser) => res.send({ data: updUser }))
    // .catch(() => {
    //   const err = new BadRequestError(
    //     `Обновление пользователя с id: ${req.params.id} невозможно`,
    //   );
    //   return next(err);
    // });
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(
      req.params._id,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true, // если пользователь не найден, он будет создан
      },
    )
    .then((updAvatar) => res.send({ data: updAvatar }))
    .catch(next);
  // .catch(() => {
  //   const err = new BadRequestError(
  //     `Обновление аватара с id: ${req.params.id} невозможно`,
  //   );
  //   return next(err);
  // });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  user.findOne({ email })
    .select('+password')
    .then((newUser) => {
      if (!newUser) {
        throw new BadAuthenticationError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, newUser.password)
        .then((matched) => {
          if (!matched) {
            throw new BadAuthenticationError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: newUser._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch(next);
};
