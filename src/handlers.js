const dataStore = require('../library/knexdataStore');

const { createClientIds } = require('./idCreators');

const checkFields = function (...fields) {
  return function (req, res, next) {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.status(400).send('Bad Request');
  };
};

const createApp = function (req, res) {
  const clientId = createClientIds();
  const clientSecret = createClientIds();
  const entries = { ...req.body, clientSecret, clientId };
  try {
    dataStore.addApplication(entries).then(() => {
      res.json({ clientId, clientSecret });
    });
  } catch (error) {
    res.status(400).send('Bad Request');
  }
};

module.exports = { checkFields, createApp };
