const knex = require('./knex');

const users = knex('users').select();
const applications = knex('applications').select();
const stories = knex('stories').select();

const addApplication = appDetails => applications.clone().insert(appDetails);

const getUserDetails = entries => users.clone().where(entries);

const getAppDetails = entries => applications.clone().where(entries);

const addUsers = entries => users.clone().insert(entries);

const addStory = entries => stories.clone().insert(entries);

const getStoryDetails = entries => stories.clone().where(entries);

module.exports = {
  getStoryDetails,
  addApplication,
  getUserDetails,
  getAppDetails,
  addUsers,
  addStory
};
