const url = require('url');
const path = require('path');
const querystring = require('querystring');
const dataStore = require('../library/knexdataStore');

const redisDatabase = require('./redisDatabase');

const checkFields = function (...fields) {
  return function (req, res, next) {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.status(400).send('Bad Request');
  };
};

const createApp = async function (req, res) {
  const clientId = await redisDatabase.getHashIds();
  const clientSecret = await redisDatabase.getHashIds();
  const ownerId = req.cookies.userId;
  const entries = { ...req.body, clientSecret, clientId, ownerId };
  try {
    const [appId] = await dataStore.addApplication(entries);
    res.json({ appId });
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

const authorize = async function (req, res) {
  const { appDetails, userDetails } = req;
  const { clientId, clientSecret, homePage, callbackUrl } = appDetails;
  const { username, password } = userDetails;
  const entries = { username, password, clientId, clientSecret };
  const code = await redisDatabase.setItem(entries, 600);
  const route = `${homePage}${callbackUrl}?code=${code}`;
  res.json({ url: route });
};

const isTokenDetailsValid = (clientId, clientSecret, details) =>
  details &&
  details.clientId === clientId &&
  details.clientSecret === clientSecret;

const getAccessToken = async function (req, res) {
  const { code, clientId, clientSecret } = req.body;
  const codeDetails = await redisDatabase.getItem(code);
  if (!isTokenDetailsValid(clientId, clientSecret, codeDetails)) {
    return res.status(405).send('You are not authorized to get Access token');
  }
  const { username, password } = codeDetails;
  const [userDetails] = await dataStore.getUserDetails({ username, password });
  res.json({ accessToken: await redisDatabase.setItem(userDetails, 60 * 60) });
};

const getUserInfo = async function (req, res) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(405).send('You are not authorized to get user details');
  }
  const userDetails = await redisDatabase.getItem(token);
  if (!userDetails) {
    return res.status(405).send('You are not authorized to get user details');
  }
  res.json(userDetails);
};

const signin = async function (req, res) {
  try {
    await dataStore.addUsers(req.body);
    res.json({ status: true });
  } catch (error) {
    res.json({ status: false });
  }
};

const login = async function (req, res) {
  const { username, password } = req.body;
  const [userDetails] = await dataStore.getUserDetails({ username, password });
  if (userDetails) {
    res.cookie('userId', userDetails.id);
    return res.json({ status: true });
  }
  return res.json({ status: false });
};

const isLoggedIn = async function (req, res) {
  const { userId } = req.cookies;
  try {
    const [userDetails] = await dataStore.getUserDetails({ id: userId });
    if (userDetails) {
      return res.json({ loggedIn: true });
    }
    return res.json({ loggedIn: false });
  } catch (error) {
    return res.json({ loggedIn: false });
  }
};

const getAppDetails = async function (req, res) {
  const entries = { id: req.body.id, ownerId: req.cookies.userId };
  try {
    const [details] = await dataStore.getAppDetails(entries);
    if (details) {
      return res.json({ protected: false, details });
    }
    return res.json({ protected: true }).status(405);
  } catch (error) {
    res.status(405).json({ protected: true });
  }
};

const checkLoginStatus = async function (req, res, next) {
  const { userId } = req.cookies;
  try {
    const [userDetails] = await dataStore.getUserDetails({ id: userId });
    if (userDetails) {
      return next();
    }
    return res.json({ protected: true }).status(405);
  } catch (error) {
    return res.json({ protected: true }).status(405);
  }
};

module.exports = {
  getAppDetails,
  checkFields,
  createApp,
  getLoginPage,
  validateSignin,
  authorize,
  getAccessToken,
  getUserInfo,
  signin,
  login,
  isLoggedIn,
  checkLoginStatus
};
