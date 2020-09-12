const dataStore = require('../library/knexdataStore');

const checkFields = function (...fields) {
  return function (req, res, next) {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.status(400).send('Bad Request');
  };
};

const createApp = function (req, res) {
  res.end();
};

module.exports = { checkFields, createApp };
