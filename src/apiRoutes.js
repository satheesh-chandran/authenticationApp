const express = require('express');
const api = express.Router();

const {
  login,
  logout,
  signin,
  addStory,
  saveStory,
  getMyApps,
  createApp,
  checkFields,
  unSaveStory,
  deleteStory,
  addResponse,
  getAppDetails,
  getAllStories,
  deleteResponse,
  getYourStories,
  getStoryDetails,
  checkLoginStatus,
  getUserDataForAll
} = require('./handlers');

api.post('/createApp', [
  checkFields('name', 'homePage', 'description', 'callbackUrl'),
  createApp
]);

api.post('/signinToApp', [
  checkFields('name', 'username', 'password', 'email', 'company'),
  signin
]);

api.post('/loginToApp', [checkFields('username', 'password'), login]);

api.use(checkLoginStatus);

api.get('/logout', logout);
api.get('/getMyApps', getMyApps);
api.get('/allStories', getAllStories);
api.get('/yourStories', getYourStories);

api.post('/saveStory', [checkFields('id'), saveStory]);
api.post('/unSaveStory', [checkFields('id'), unSaveStory]);
api.post('/deleteStory', [checkFields('id'), deleteStory]);
api.post('/getStory', [checkFields('id'), getStoryDetails]);
api.post('/getAppDetails', [checkFields('id'), getAppDetails]);
api.post('/addStory', [checkFields('title', 'body'), addStory]);
api.post('/deleteResponse', [checkFields('id'), deleteResponse]);
api.post('/userDetails', [checkFields('id'), getUserDataForAll]);
api.post('/addResponse', [checkFields('storyId', 'message'), addResponse]);

module.exports = api;
