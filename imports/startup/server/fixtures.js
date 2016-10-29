import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Chance from 'chance';
import Users from '../../api/users/users.js';
import Boards from '../../api/boards/boards.js';

Meteor.startup(() => {
  const chance = new Chance();

  Users.remove({});
  Boards.remove({});

  const pitxonId = Accounts.createUser({
    username: 'pitxon',
    password: 'password',
  });

  const giorgixId = Accounts.createUser({
    username: 'giorgix',
    password: 'password',
  });

  // pitxon boards
  Boards.insert({
    userId: pitxonId,
    username: 'pitxon',
    name: 'dogs',
    description: chance.paragraph(),
    isPrivate: true,
    imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });

  Boards.insert({
    userId: pitxonId,
    name: 'cats',
    username: 'pitxon',
    description: chance.paragraph(),
    isPrivate: true,
    imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });

  Boards.insert({
    userId: pitxonId,
    name: 'horses',
    username: 'pitxon',
    description: chance.paragraph(),
    isPrivate: false,
    imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });

  // giorgix boards
  Boards.insert({
    userId: giorgixId,
    name: 'beers',
    username: 'giorgix',
    description: chance.paragraph(),
    isPrivate: true,
    imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });

  Boards.insert({
    userId: giorgixId,
    username: 'giorgix',
    name: 'whisky',
    description: chance.paragraph(),
    isPrivate: false,
    imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });
});
