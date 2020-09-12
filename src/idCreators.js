const crypto = require('crypto');

const idCreator = (() => {
  let id = 1;
  return () => id++;
})();

const createClientIds = function () {
  const hash = crypto.createHash('sha1').update(`${+new Date() * idCreator()}`);
  return hash.digest('hex');
};

module.exports = { createClientIds };
