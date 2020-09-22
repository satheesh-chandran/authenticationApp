const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const {
  getMyApps,
  getYourStories,
  getAppDetails,
  checkLoginStatus,
  checkFields,
  createApp,
  getLoginPage,
  validateSignin,
  authorize,
  getAccessToken,
  getUserInfo,
  addStory,
  signin,
  login,
  isLoggedIn,
  getStoryDetails,
  getAllStories,
  addResponse,
  logout
} = require('./handlers');
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.post('/api/createApp', [
  checkFields('name', 'homePage', 'description', 'callbackUrl'),
  createApp
]);

app.get('/login/oauth/authorize', getLoginPage);

app.post('/authorizeToApp', [
  checkFields('username', 'password'),
  validateSignin,
  authorize
]);

app.post('/login/oauth/access_token', [
  checkFields('code', 'clientSecret', 'clientId'),
  getAccessToken
]);

app.post('/api/signinToApp', [
  checkFields('name', 'username', 'password', 'email', 'company'),
  signin
]);

app.post('/api/loginToApp', [checkFields('username', 'password'), login]);

app.get('/users', getUserInfo);

app.get('/isLoggedIn', isLoggedIn);

app.post('/api/getAppDetails', [
  checkFields('id'),
  checkLoginStatus,
  getAppDetails
]);

app.get('/api/getMyApps', [checkLoginStatus, getMyApps]);

app.post('/api/addStory', [
  checkLoginStatus,
  checkFields('title', 'body'),
  addStory
]);

app.post('/api/getStory', [
  checkLoginStatus,
  checkFields('id'),
  getStoryDetails
]);

app.get('/api/allStories', [checkLoginStatus, getAllStories]);

app.get('/api/yourStories', [checkLoginStatus, getYourStories]);

app.post('/api/addResponse', [
  checkLoginStatus,
  checkFields('storyId', 'message'),
  addResponse
]);

app.get('/api/logout', logout);

module.exports = { app };
