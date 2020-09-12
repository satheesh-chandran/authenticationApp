const express = require('express');
const morgan = require('morgan');
const { checkFields, createApp } = require('./handlers');
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('public'));

app.post('/createApp', [
  checkFields('name', 'homePage', 'description', 'callbackUrl'),
  createApp
]);

module.exports = { app };
