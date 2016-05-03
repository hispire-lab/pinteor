import faker from 'faker';
import { Users } from './users/users.js';
import { Boards } from './boards/boards.js';
import { Pins } from './pins/pins.js';
import { Comments } from './comments/comments.js';
import { Factory } from 'meteor/dburles:factory';

/*
 * FIXME: i couldn't find a way to make a relationship between two collections
 * with factories, in the docs says that in order to make a relationship use
 * something like:
 *
 * Factory.define('user', Users, {
 *   username: faker.internet.userName(),
 *   createdAt: new Date(),
 * });
 *
 * Factory.define('board', Boards, {
 *   userId: Factory.get('user'),
 *   name: 'board A',
 *   slug: 'board-a',
 *   description: faker.lorem.sentence(),
 *   createdAt: new Date(),
 *   isPrivate: false,
 * });
 *
 * but the Factory.get method not creates a new user in the database, so in the
 * test whenever i want a board and a user i have to create both and make the
 * relationship manually like:
 *
 * const user = Factory.create('user');
 * const board = Factory.create('board', { userId: user._id });
 */
Factory.define('user', Users, {
  username: faker.internet.userName(),
  createdAt: new Date(),
});

Factory.define('board', Boards, {
  name: 'board A',
  slug: 'board-a',
  description: faker.lorem.sentence(),
  createdAt: new Date(),
  isPrivate: false,
});

Factory.define('pin', Pins, {
  title: 'pin A',
  imgUrl: faker.image.imageUrl(),
  createdAt: new Date(),
  isPrivate: false,
});

Factory.define('comment', Comments, {
  text: faker.lorem.sentence(),
});
