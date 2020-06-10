'use strict';

const User = use('App/Models/User');
const Token = use('App/Models/Token');

class UserSeeder {
  async run() {
    const users = await User.all();
    for (const user of users.rows) {
      await Token.query()
        .where('user_id', user.id)
        .delete();
      await user.delete();
    }

    const user = new User();
    user.email = 'admin@mail.com';
    user.role = 'admin';
    user.name= 'admin';
    user.phone= '0700000000';
    user.password = 'admin';
    await user.save();
  }
}

module.exports = UserSeeder;

