const url = require('url');
const path = require('path');
const querystring = require('querystring');
const dataStore = require('../library/knexdataStore');

const { getHashIds } = require('./idCreators');
const { CodeManager, TokenManager } = require('./codeManager');

const codeManager = new CodeManager();
const tokenManager = new TokenManager();

const checkFields = function (...fields) {
  return function (req, res, next) {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.status(400).send('Bad Request');
  };
};

const createApp = async function (req, res) {
  const clientId = getHashIds();
  const clientSecret = getHashIds();
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

const signinToApp = function (req, res) {
  const { appDetails, userDetails } = req;
  const { clientId, clientSecret, homePage, callbackUrl } = appDetails;
  const { username, password } = userDetails;
  const entries = { username, password, clientId, clientSecret };
  const code = codeManager.addCode(entries);
  const route = `${homePage}${callbackUrl}?code=${code}`;
  res.json({ url: route });
};

const isTokenDetailsValid = (clientId, clientSecret, details) =>
  details &&
  details.clientId === clientId &&
  details.clientSecret === clientSecret;

const getAccessToken = async function (req, res) {
  const { code, clientId, clientSecret } = req.body;
  const codeDetails = codeManager.getCodeDetails(code);
  if (!isTokenDetailsValid(clientId, clientSecret, codeDetails)) {
    return res.status(405).send('You are not authorized to get Access token');
  }
  const { username, password } = codeDetails;
  const [userDetails] = await dataStore.getUserDetails({ username, password });
  res.json({ accessToken: tokenManager.addToken(userDetails) });
};

const getUserInfo = function (req, res) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(405).send('You are not authorized to get user details');
  }
  const userDetails = tokenManager.getUserDetails(token);
  if (!userDetails) {
    return res.status(405).send('You are not authorized to get user details');
  }
  res.json(userDetails);
};

module.exports = {
  checkFields,
  createApp,
  getLoginPage,
  validateSignin,
  signinToApp,
  getAccessToken,
  getUserInfo
};
