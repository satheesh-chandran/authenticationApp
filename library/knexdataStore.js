const knex = require('./knex');

const users = knex('users').select();
const applications = knex('applications').select();
const stories = knex('stories').select();
const responses = knex('responses').select();
const allStories = stories
  .clone()
  .leftJoin(users.clone().as('users'), 'stories.ownerId', 'users.id');

const allResponses = responses
  .clone()
  .select('responses.*', 'username')
  .leftJoin(users.clone().as('users'), 'responses.ownerId', 'users.id')
  .as('allResponses');

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

const insertResponse = response => responses.clone().insert(response);

const getUserDetails = entries => users.clone().where(entries);

const getAppDetails = entries => applications.clone().where(entries);

const addUsers = entries => users.clone().insert(entries);

const addStory = entries => stories.clone().insert(entries);

const getAllStories = () => allStories.clone().select(storyFormat);

const getYourStories = entries =>
  allStories.clone().select(storyFormat).where(entries);

const getStories = entries =>
  allStories.clone().select(storyFormat).where(entries);

const includeResponse = (story, storyId) =>
  allResponses
    .clone()
    .where({ storyId })
    .then(responses => {
      story.responses = responses;
      return story;
    });

const getStoryDetails = storyId =>
  allStories
    .clone()
    .select(storyFormat)
    .where({ ['stories.id']: storyId })
    .then(([story]) => includeResponse(story, storyId));

const deleteResponse = (id, ownerId) =>
  responses.clone().del().where({ id, ownerId });

const deleteStory = (id, ownerId) =>
  stories.clone().del().where({ id, ownerId });

module.exports = {
  addStory,
  addUsers,
  getStories,
  deleteStory,
  getAllStories,
  getAppDetails,
  deleteResponse,
  insertResponse,
  addApplication,
  getUserDetails,
  getYourStories,
  getStoryDetails,
};
