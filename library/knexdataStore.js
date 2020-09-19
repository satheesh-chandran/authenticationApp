const knex = require('./knex');

const users = knex('users').select();
const applications = knex('applications').select();
const stories = knex('stories').select();
const allStories = stories
  .clone()
  .leftJoin(users.clone().as('users'), 'ownerId', 'users.id');

const storyFormat = [
  'stories.id as id',
  'stories.title as title',
  'stories.body as body',
  'stories.claps as claps',
  'stories.receivedAt as receivedAt',
  'name',
  'username'
];

const addApplication = appDetails => applications.clone().insert(appDetails);

const getUserDetails = entries => users.clone().where(entries);

const getAppDetails = entries => applications.clone().where(entries);

const addUsers = entries => users.clone().insert(entries);

const addStory = entries => stories.clone().insert(entries);

const getAllStories = () => allStories.clone().select(storyFormat);

const getYourStories = entries =>
  allStories.clone().select(storyFormat).where(entries);

const getStoryDetails = entries =>
  allStories.clone().select(storyFormat).where(entries);

const getStories = entries =>
  allStories.clone().select(storyFormat).where(entries);

module.exports = {
  getStoryDetails,
  getStories,
  addApplication,
  getUserDetails,
  getAppDetails,
  addUsers,
  addStory,
  getAllStories,
  getYourStories
};
