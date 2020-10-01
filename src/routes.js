const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const {
  authorize,
  isLoggedIn,
  getUserInfo,
  checkFields,
  getLoginPage,
  validateSignin,
  getAccessToken
} = require('./handlers');

const api = require('./apiRoutes');
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('build'));
app.use(cookieParser());

app.get('/login/oauth/authorize', getLoginPage);
app.get('/users', getUserInfo);
app.get('/isLoggedIn', isLoggedIn);

app.post('/authorizeToApp', [
  checkFields('username', 'password'),
  validateSignin,
  authorize
]);

app.post('/login/oauth/access_token', [
  checkFields('code', 'clientSecret', 'clientId'),
  getAccessToken
]);

app.use('/api', api);

module.exports = { app };
