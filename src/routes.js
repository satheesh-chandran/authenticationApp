const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const {
  login,
  logout,
  signin,
  addStory,
  getMyApps,
  createApp,
  authorize,
  isLoggedIn,
  getUserInfo,
  deleteStory,
  addResponse,
  deleteResponse,
  checkFields,
  getLoginPage,
  getAppDetails,
  getAllStories,
  validateSignin,
  getYourStories,
  getAccessToken,
  getStoryDetails,
  checkLoginStatus
} = require('./handlers');
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.get('/login/oauth/authorize', getLoginPage);
app.get('/users', getUserInfo);
app.get('/isLoggedIn', isLoggedIn);

app.post('/api/createApp', [
  checkFields('name', 'homePage', 'description', 'callbackUrl'),
  createApp
]);

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

app.use(checkLoginStatus);

app.get('/api/logout', [logout]);
app.get('/api/getMyApps', [getMyApps]);
app.get('/api/allStories', [getAllStories]);
app.get('/api/yourStories', [getYourStories]);

app.post('/api/deleteStory', [checkFields('id'), deleteStory]);
app.post('/api/getStory', [checkFields('id'), getStoryDetails]);
app.post('/api/getAppDetails', [checkFields('id'), getAppDetails]);
app.post('/api/addStory', [checkFields('title', 'body'), addStory]);
app.post('/api/deleteResponse', [checkFields('id'), deleteResponse]);
app.post('/api/addResponse', [checkFields('storyId', 'message'), addResponse]);

module.exports = { app };
