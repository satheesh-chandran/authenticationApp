const express = require('express');
const morgan = require('morgan');
const {
  checkFields,
  createApp,
  getLoginPage,
  validateSignin,
  signinToApp,
  getAccessToken,
  getUserInfo
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

app.post('/signinToApp', [
  checkFields('username', 'password'),
  validateSignin,
  signinToApp
]);

app.post('/login/oauth/access_token', [
  checkFields('code', 'clientSecret', 'clientId'),
  getAccessToken
]);

app.get('/users', getUserInfo);

module.exports = { app };
