exports.seed = function (knex) {
  return knex.transaction(async function (trx) {
    await trx('users').insert([
      {
        id: 0,
        name: 'Satheesh',
        username: 'satheesh',
        password: 'satheesh@123',
        age: 21,
        houseName: 'Panampilly House',
        district: 'Thrissur',
        state: 'Kerala'
      },
      {
        id: 1,
        name: 'Anil',
        username: 'anil',
        password: 'anil@123',
        age: 22,
        houseName: 'Erippikkal',
        district: 'Palakkad',
        state: 'Kerala'
      },
      {
        id: 2,
        name: 'Thanya',
        age: 23,
        username: 'thanya',
        password: 'thanya@123',
        houseName: 'Cherumanalil',
        district: 'Kannur',
        state: 'Kerala'
      },
      {
        id: 3,
        name: 'Sruthy',
        username: 'sruthy',
        password: 'sruthy@123',
        age: 24,
        houseName: 'Kalarikkal',
        district: 'Coimbatore',
        state: 'Tamilnadu'
      }
    ]);
  });
};
