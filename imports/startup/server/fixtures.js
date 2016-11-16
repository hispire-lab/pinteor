import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Factory } from 'meteor/dburles:factory';
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

  const pitxonBoard = Factory.create('board', {
    userId: pitxonId,
    username: 'pitxon',
    name: 'cars',
    isPrivate: true,
    // imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });

  Factory.create('pin', {
    userId: pitxonBoard.userId,
    username: pitxonBoard.username,
    boardId: pitxonBoard._id,
    imageUrl: 'http://www.fastcoolcars.com/images/Index%20page/2014vetteL.jpg',
  });

  Factory.create('pin', {
    userId: pitxonBoard.userId,
    username: pitxonBoard.username,
    boardId: pitxonBoard._id,
    imageUrl: 'https://s-media-cache-ak0.pinimg.com/originals/9f/70/c8/9f70c84c681c0199a23fbf814014c30f.jpg',
  });

  Factory.create('pin', {
    userId: pitxonBoard.userId,
    username: pitxonBoard.username,
    boardId: pitxonBoard._id,
    imageUrl: 'http://1.bp.blogspot.com/-TeIBE19TCDg/Tw7RFW7nmHI/AAAAAAAAAM8/GPrIU67OPuY/s1600/cool_car.jpg',
  });

  Boards.insert({
    userId: pitxonId,
    username: 'pitxon',
    name: 'dogs',
    description: chance.paragraph(),
    isPrivate: true,
    // imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });

  Boards.insert({
    userId: pitxonId,
    name: 'cats',
    username: 'pitxon',
    description: chance.paragraph(),
    isPrivate: true,
    // imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });

  Boards.insert({
    userId: pitxonId,
    name: 'horses',
    username: 'pitxon',
    description: chance.paragraph(),
    isPrivate: false,
    // imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });

  // giorgix boards
  Boards.insert({
    userId: giorgixId,
    name: 'beers',
    username: 'giorgix',
    description: chance.paragraph(),
    isPrivate: true,
    // imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });

  Boards.insert({
    userId: giorgixId,
    username: 'giorgix',
    name: 'whisky',
    description: chance.paragraph(),
    isPrivate: false,
    // imageUrl: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
  });
});
