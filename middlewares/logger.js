/* eslint-disable linebreak-style */
const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({ // логгер запросов
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});


module.exports = {
  requestLogger,
  errorLogger,
};