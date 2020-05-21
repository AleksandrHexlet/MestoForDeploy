require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const routerCards = require('./routes/cards');
const routerUsers = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: true, // создаём уникальный индекс в монго
});
app.use(requestLogger);
app.post('/signin', login);
app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        name: Joi.string().required().min(2).max(30),
        // age: Joi.number().integer().required().min(18),
        avatar: Joi.string().regex(
          /http(s)?:\/\/?(([0-9]{0,3}\.[0-5]{0,3}\.[0-5]{0,3}\.)([0-2]?[0-5]?[0-5]?)|(www.)?\w+(\.|\/)+[A-Za-z]{2,})(:6[0-5]{1,4})?(:[1-5][0-9]{1,4}|:[0-9]{2,4})?#?/,
        ),

        about: Joi.string().min(2).max(30),
      })
      .unknown(true),
  }),
  createUser,
);

app.use(auth);

app.use(routerCards);
app.use(routerUsers);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   let { message } = err;
//   if (err.name === 'ValidationError') {
//     return res.status(400).send('ValidationError');
//   }
//   if (status === 500) {
//     console.error(err.stack || err);
//     message = 'unexpected error';
//   }
//   return res.status(status).send(message);
// });
app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка на сервере' : message,
  });
});


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started in ${PORT}`);
});
