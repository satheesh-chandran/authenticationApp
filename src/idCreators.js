const crypto = require('crypto');

const idProvider = () => {
  const hash = crypto.createHash('sha1').update(`${+new Date()}`);
  return hash.digest('hex').slice(0, 10);
};

const idCreator = (() => {
  let id = 1;
  return () => id++;
})();
