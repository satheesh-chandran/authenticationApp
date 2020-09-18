const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const {
  getAppDetails,
  checkLoginStatus,
  checkFields,
  createApp,
  getLoginPage,
  validateSignin,
  authorize,
  getAccessToken,
  getUserInfo,
  signin,
  login,
  isLoggedIn
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

module.exports = { app };
