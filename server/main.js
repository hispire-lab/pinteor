import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Users } from '../imports/api/users/users.js';
import { Boards } from '../imports/api/boards/boards.js';

import '../imports/api/users/server/publications';

Meteor.startup(() => {
  if (Users.find({ username: 'pitxon' }).count() === 0) {
    const userId = Accounts.createUser({
      username: 'pitxon',
      password: 'password',
    });

    Boards.insert({
      userId,
      name: 'board A',
    });
  }
});
