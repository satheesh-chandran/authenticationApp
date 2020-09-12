exports.seed = function (knex) {
  return knex.transaction(async function (trx) {
    await trx('persons').insert([
      {
        id: 0,
        name: 'Satheesh',
        age: 21,
        houseName: 'Panampilly House',
        district: 'Thrissur',
        state: 'Kerala'
      },
      {
        id: 1,
        name: 'Anil',
        age: 22,
        houseName: 'Elarikkal',
        district: 'Palakkad',
        state: 'Kerala'
      },
      {
        id: 2,
        name: 'Thanya',
        age: 23,
        houseName: 'Cherumanalil',
        district: 'Kannur',
        state: 'Kerala'
      },
      {
        id: 3,
        name: 'Sruthy',
        age: 24,
        houseName: 'Kalarikkal',
        district: 'Coimbatore',
        state: 'Tamilnadu'
      }
    ]);
  });
};
