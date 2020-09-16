exports.seed = function (knex) {
  return knex.transaction(async function (trx) {
    await trx('users').insert([
      {
        name: 'satheesh',
        username: 'satheesh',
        password: 'satheesh@123',
        company: 'thoughtworks',
        email: 'satheesh@thoughtworks.com'
      },
      {
        name: 'anil',
        username: 'anil',
        password: 'anil@123',
        company: 'thoughtworks',
        email: 'anil@thoughtworks.com'
      },
      {
        name: 'sruthy',
        username: 'sruthy',
        password: 'sruthy@123',
        company: 'thoughtworks',
        email: 'sruthy@thoughtworks.com'
      },
      {
        name: 'thanya',
        username: 'thanya',
        password: 'thanya@123',
        company: 'thoughtworks',
        email: 'thanya@thoughtworks.com'
      }
    ]);
  });
};
