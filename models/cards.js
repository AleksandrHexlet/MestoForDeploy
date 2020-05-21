// eslint-disable-next-line import/no-unresolved
const validator = require('validator');
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Please enter your name',
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: 'true',
    validate: {
      validator: (value) => validator.isURL(value),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: 'Please send your name',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);


// eslint-disable-next-line max-len
// RegExp for URL  match: /http(s)?:\/\/?(([0-9]{0,3}\.[0-5]{0,3}\.[0-5]{0,3}\.)([0-2]?[0-5]?[0-5]?)|(www.)?\w+(\.|\/)+[A-Za-z]{2,})(:6[0-5]{1,4})?(:[1-5][0-9]{1,4}|:[0-9]{2,4})?#?/,
