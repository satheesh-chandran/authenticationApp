const url = require('url');
const path = require('path');
const querystring = require('querystring');
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

const validateSignin = async function (req, res, next) {
  const parsed = querystring.parse(url.parse(req.headers.referer).query);
  const { clientId, callbackUrl } = parsed;
  const { username, password } = req.body;
  const [appDetails] = await dataStore.getAppDetails({ clientId, callbackUrl });
  if (!appDetails) {
    return res.status(404).send('App not found');
  }
  const [userDetails] = await dataStore.getUserDetails({ username, password });
  if (!userDetails) {
    return res.status(404).send('User name and password did not match');
  }
  req.appDetails = appDetails;
  req.userDetails = userDetails;
  next();
};

const signinToApp = async function (req, res) {
  const { appDetails, userDetails } = req;
  res.json({});
};

module.exports = {
  checkFields,
  createApp,
  getLoginPage,
  validateSignin,
  signinToApp
};
