const redis = require('redis');
const crypto = require('crypto');

const client = redis.createClient(process.env.REDIS_URL);

const getCurrentId = function () {
  return new Promise((resolve, reject) => {
    client.incr('curr_id', (err, id) => {
      if (err) {
        reject(err);
      }
      resolve(id);
    });
  });
};

const getHashIds = () =>
  getCurrentId().then(id => {
    const hash = crypto.createHash('sha1').update(`${+new Date() * id}`);
    return hash.digest('hex');
  });

const addCodeHash = function (entries, time) {
  return new Promise((resolve, reject) => {
    getHashIds().then(hash => {
      client.set(hash, JSON.stringify(entries), 'EX', time, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const getItem = function (code) {
  return new Promise((resolve, reject) => {
    client.get(code, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(res));
    });
  });
};

module.exports = { getCurrentId, getHashIds, addCodeHash, getItem };
