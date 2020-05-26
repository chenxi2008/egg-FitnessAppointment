const Service = require('egg').Service;
const db = require('better-sqlite3')('test.sqlite3');
class UserService extends Service {
  async find() {
    return db.prepare('select * from user')
  }
}

module.exports = UserService;
