const knex = require('./knex');

const users = knex('users').select();
const stories = knex('stories').select();
const responses = knex('responses').select();
const applications = knex('applications').select();
const savedStories = knex('savedStories').select();

const allStories = stories
  .clone()
  .leftJoin(users.clone().as('users'), 'stories.ownerId', 'users.id');

const allResponses = responses
  .clone()
  .select('responses.*', 'username')
  .leftJoin(users.clone().as('users'), 'responses.ownerId', 'users.id')
  .as('allResponses');

const allSavedStories = savedStories
  .clone()
  .leftJoin(
    allStories.clone().as('allStories'),
    'savedStories.storyId',
    'allStories.id'
  );

const storyFormat = [
  'stories.id as id',
  'stories.title as title',
  'stories.body as body',
  'stories.claps as claps',
  'stories.receivedAt as receivedAt',
  'name',
  'username',
  'ownerId'
];

const getUserDetails = entries => users.clone().where(entries);
const addUsers = userDetails => users.clone().insert(userDetails);
const saveStory = entries => savedStories.clone().insert(entries);
const getAllStories = () => allStories.clone().select(storyFormat);
const getAppDetails = entries => applications.clone().where(entries);
const addStory = storyDetails => stories.clone().insert(storyDetails);
const insertResponse = response => responses.clone().insert(response);
const deleteResponse = entries => responses.clone().del().where(entries);
const unSaveStories = entries => savedStories.clone().del().where(entries);
const addApplication = appDetails => applications.clone().insert(appDetails);
const getStories = entries => allStories.clone().select(storyFormat).where(entries);
const getYourStories = entries => allStories.clone().select(storyFormat).where(entries);

const includeResponse = (story, storyId, reqOwner) =>
  allResponses
    .clone()
    .where({ storyId })
    .then(responses => {
      story.responses = responses;
      responses.forEach(res => {
        res.isMine = res.ownerId == reqOwner;
      });
      return story;
    });

const getStoryDetails = (storyId, reqOwner) =>
  allStories
    .clone()
    .select(storyFormat)
    .where({ ['stories.id']: storyId })
    .then(([story]) => includeResponse(story, storyId, reqOwner))
    .then(story => {
      story.isMine = story.ownerId === reqOwner;
      return story;
    });

const deleteStory = (id, ownerId) =>
  stories
    .clone()
    .del()
    .where({ id, ownerId })
    .then(() => deleteResponse({ storyId: id }));

const getSavedStories = () => {
  return allSavedStories.clone().select();
};

module.exports = {
  addStory,
  addUsers,
  saveStory,
  getStories,
  deleteStory,
  getAllStories,
  getAppDetails,
  unSaveStories,
  deleteResponse,
  insertResponse,
  addApplication,
  getUserDetails,
  getYourStories,
  getStoryDetails,
  getSavedStories
};
