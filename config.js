/* eslint-disable radix */
module.exports = {
  PORT: parseInt(process.env.PORT) || 3000,
  DATABASE_URL: 'mongodb://localhost:27017/mestodb',
  JWT_SECRET: parseInt(process.env.JWT_SECRET) || 'JWT_SECRET',
};
