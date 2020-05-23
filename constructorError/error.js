/* eslint-disable linebreak-style */
/* eslint-disable max-classes-per-file */
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
class BadAuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
class IdNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  BadRequestError,
  BadAuthenticationError,
  IdNotFoundError,
};
