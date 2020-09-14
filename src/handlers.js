const path = require('path');
const url = require('url');
const dataStore = require('../library/knexdataStore');
const querystring = require('querystring');

const { createClientIds } = require('./idCreators');

const checkFields = function (...fields) {
  return function (req, res, next) {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.status(400).send('Bad Request');
  };
};

const createApp = async function (req, res) {
  const clientId = createClientIds();
  const clientSecret = createClientIds();
  const entries = { ...req.body, clientSecret, clientId };
  try {
    await dataStore.addApplication(entries);
    res.json({ clientId, clientSecret });
  } catch (error) {
    res.status(400).send('Bad Request');
  }
};

const getLoginPage = async function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.sendFile(path.resolve(`${__dirname}/../public/login.html`));
};

const signinToApp = function (req, res) {
  const parsed = querystring.parse(url.parse(req.headers.referer).query);
  const { clientId, callbackUrl } = parsed;
  const { username, password } = req.body;
  res.json({});
};

module.exports = { checkFields, createApp, getLoginPage, signinToApp };
