exports.seed = function (knex) {
  return knex.transaction(async function (trx) {
    await trx('users').insert([
      {
        name: 'Satheesh',
        username: 'satheesh',
        password: 'satheesh@123',
        company: 'thoughtworks',
        email: 'satheesh@thoughtworks.com'
      },
      {
        name: 'Anil',
        username: 'anil',
        password: 'anil@123',
        company: 'thoughtworks',
        email: 'anil@thoughtworks.com'
      },
      {
        name: 'Sruthy',
        username: 'sruthy',
        password: 'sruthy@123',
        company: 'thoughtworks',
        email: 'sruthy@thoughtworks.com'
      },
      {
        name: 'Thanya',
        username: 'thanya',
        password: 'thanya@123',
        company: 'thoughtworks',
        email: 'thanya@thoughtworks.com'
      }
    ]);

    await trx('applications').insert([
      {
        name: 'Blog application demo',
        homePage: 'http://localhost:7000',
        clientId: 'b8276371a3e0ff28dad2f3c98c43d3bb217efe8b',
        clientSecret: '93dbd2b43ad247ee45e4505bf181742dc0fee25a',
        description: 'This an auth app created for showcase',
        callbackUrl: '/user/auth',
        ownerId: 1
      }
    ]);

    await trx('stories').insert([
      {
        title:
          'Tools to strengthen the connection between you and your audience',
        body:
          'September is for new beginnings. Getting organized. Starting fresh, coming out of the brief lull of August. This year, August was different. Instead of traveling for weddings or vacations, it was staycations, maybe moving, and if possible, taking a break or at least slowing down to reflect and recharge. Perhaps in that time, you came up with new creative ideas to get started on this month.',
        ownerId: 1
      },
      {
        title: 'Summer writing, summer learning',
        body:
          'Summer is here. While there are familiar elements of summer, it’s different this year. We have the challenges of the coronavirus, and important racial justice work to do. It’s helpful to note that your writing practice can be a place of support, learning, and processing. It can be a place of growth. And it can be a place of creativity and expression.',
        ownerId: 1
      },
      {
        title: 'Introducing image grids',
        body:
          'When you click the “image” tool during the drafting of your story, try selecting multiple picture files from the pop-up window. Then, watch how Medium automatically lays them into a grid, depending on the number of images you selected. You can also click any individual image to see it bigger.',
        ownerId: 2
      }
    ]);

    await trx('responses').insert([
      { message: 'Very informative content.', ownerId: 3, storyId: 1 },
      {
        message:
          'I hope to see such stories going forward. Thank you satheesh.',
        ownerId: 4,
        storyId: 1
      },
      { message: 'Interesting. Wrote well.', ownerId: 3, storyId: 3 }
    ]);
  });
};
