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

const signin = (req, res) =>
  dataStore
    .addUsers(req.body)
    .then(() => res.json({ status: true }))
    .catch(() => res.json({ status: false }));

const login = (req, res) =>
  dataStore.getUserDetails(req.body).then(([userDetails]) => {
    if (userDetails) {
      return res.cookie('userId', userDetails.id).json({ status: true });
    }
    return res.json({ status: false });
  });

const isLoggedIn = (req, res) =>
  dataStore
    .getUserDetails({ id: req.cookies.userId })
    .then(([userDetails]) => {
      if (userDetails) {
        const { id, name } = userDetails;
        return res.json({ loggedIn: true, userDetails: { id, name } });
      }
      return res.json({ loggedIn: false, userDetails: {} });
    })
    .catch(() => res.json({ loggedIn: false, userDetails: {} }));

const getAppDetails = (req, res) =>
  dataStore
    .getAppDetails({ id: req.body.id, ownerId: req.cookies.userId })
    .then(([details]) => {
      if (details) {
        return res.json({ protected: false, details });
      }
      return res.status(405).json({ protected: true });
    })
    .catch(() => res.status(405).json({ protected: true }));

const getMyApps = (req, res) =>
  dataStore
    .getAppDetails({ ownerId: req.cookies.userId })
    .then(apps => res.json({ protected: false, apps }))
    .catch(() => res.status(405).json({ protected: true }));

const addStory = (req, res) =>
  dataStore
    .addStory({ ...req.body, ownerId: req.cookies.userId })
    .then(storyId => res.json({ storyId }));

const getStoryDetails = (req, res) =>
  dataStore
    .getStoryDetails(req.body.id, +req.cookies.userId)
    .then(storyDetails => res.json(storyDetails))
    .catch(() => res.status(404).json({ status: 'Item not found' }));

const getAllStories = (req, res) =>
  dataStore.getAllStories().then(stories => res.json(stories));

const getYourStories = (req, res) =>
  dataStore
    .getYourStories({ ownerId: req.cookies.userId })
    .then(stories => res.json(stories));

const addResponse = (req, res) =>
  dataStore
    .insertResponse({ ...req.body, ownerId: req.cookies.userId })
    .then(() => res.json({ status: true }))
    .catch(() => res.json({ status: true }));

const logout = (req, res) => res.clearCookie('userId').json({ status: true });

const deleteResponse = (req, res) =>
  dataStore
    .deleteResponse({ id: req.body.id, ownerId: +req.cookies.userId })
    .then(() => res.json({ status: true }))
    .catch(() => res.json({ status: false }));

const deleteStory = (req, res) =>
  dataStore
    .deleteStory(req.body.id, req.cookies.userId)
    .then(() => res.json({ status: true }))
    .catch(() => res.json({ status: true }));

const getUserDataForAll = (req, res) =>
  dataStore.getUserDetails({ id: req.body.id }).then(([userDetails]) => {
    if (userDetails) {
      delete userDetails.password;
      return res.json(userDetails);
    }
    return res.json({});
  });

const saveStory = (req, res) =>
  dataStore
    .saveStory({ userId: req.cookies.userId, storyId: req.body.id })
    .then(() => res.json({ status: true }))
    .catch(() => res.json({ status: false }));

const unSaveStory = (req, res) =>
  dataStore
    .unSaveStory({ userId: req.cookies.userId, storyId: req.body.id })
    .then(() => res.json({ status: true }))
    .catch(() => res.json({ status: false }));

const getSavedStories = (req, res) =>
  dataStore
    .getSavedStories(req.cookies.userId)
    .then(stories => res.json(stories))
    .catch(() => res.status(404).json([]));

module.exports = {
  login,
  signin,
  logout,
  addStory,
  saveStory,
  authorize,
  getMyApps,
  createApp,
  isLoggedIn,
  unSaveStory,
  getUserInfo,
  addResponse,
  checkFields,
  deleteStory,
  getLoginPage,
  getAllStories,
  getAppDetails,
  getYourStories,
  deleteResponse,
  validateSignin,
  getAccessToken,
  getSavedStories,
  getStoryDetails,
  checkLoginStatus,
  getUserDataForAll
};
