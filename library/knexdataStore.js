const knex = require('./knex');

const persons = knex('persons').select();
const applications = knex('applications').select();

const addApplication = appDetails => applications.clone().insert(appDetails);

const getPersonDetails = id => persons.clone().where({ id });

module.exports = { addApplication, getPersonDetails };
