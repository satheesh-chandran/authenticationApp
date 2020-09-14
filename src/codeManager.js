const { getHashIds } = require('./idCreators');

class CodeManager {
  constructor() {
    this.codeCredentials = {};
  }

  deleteCode(code) {
    delete this.codeCredentials[code];
  }

  addCode(entries) {
    const code = getHashIds();
    this.codeCredentials[code] = entries;
    setTimeout(() => this.deleteCode(code), 3000);
    return code;
  }

  getCodeDetails(code) {
    return this.codeCredentials[code];
  }
}

class TokenManager {
  constructor() {
    this.tokenCredentials = {};
  }

  addToken(entries) {
    const token = getHashIds();
    this.tokenCredentials[token] = entries;
    return token;
  }

  getUserDetails(token) {
    return this.tokenCredentials[token];
  }
}

module.exports = { CodeManager, TokenManager };
