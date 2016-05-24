import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Users } from '../imports/api/users/users.js';
import { Boards } from '../imports/api/boards/boards.js';
import '../imports/api/boards/methods.js';
import '../imports/api/users/server/publications';

import faker from 'faker';

Meteor.startup(() => {
  if (Users.find({ username: 'pitxon' }).count() === 0) {
    const userId = Accounts.createUser({
      username: 'pitxon',
      password: 'password',
    });

    Boards.insert({
      userId,
      name: 'board A',
      description: faker.lorem.sentence(),
    });

    Boards.insert({
      userId,
      name: 'board B',
      description: faker.lorem.sentence(),
    });

    Boards.insert({
      userId,
      name: 'board C',
      description: faker.lorem.sentence(),
    });
  }
});
