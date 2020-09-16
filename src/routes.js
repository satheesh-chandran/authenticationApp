const express = require('express');
const morgan = require('morgan');
const {
  checkFields,
  createApp,
  getLoginPage,
  validateSignin,
  authorize,
  getAccessToken,
  getUserInfo,
  signin,
  login
} = require('./handlers');
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('public'));

app.post('/createApp', [
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

module.exports = { app };
