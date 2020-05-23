const jwt = require('jsonwebtoken');
const { BadAuthenticationError } = require('../constructorError/error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return res.status(401).send({ message: 'Пожалуйста пройдите авторизацию' });
    throw new BadAuthenticationError('Пожалуйста пройдите авторизацию');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (nextt) {
    throw new BadAuthenticationError('Необходима авторизация');
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
