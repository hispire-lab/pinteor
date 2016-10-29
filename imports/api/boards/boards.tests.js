/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import Chance from 'chance';
import Boards from './boards.js';
import Users from '../users/users.js';
import { boardsInsert, boardsUpdate } from './methods.js';

const chance = new Chance();

Factory.define('user', Users, {
  _id: Random.id(),
  username: chance.name(),
  boardsCount: 0,
  createdAt: new Date(),
});

Factory.define('board', Boards, {
  _id: Random.id(),
  userId: Random.id(),
  username: chance.name(),
  name: chance.word({ length: 6 }),
  description: chance.sentence(),
  isPrivate: true,
  createdAt: new Date(),
  imageUrl: chance.url({ extensions: ['.jpg', '.gif', '.png'] }),
});

if (Meteor.isServer) {
  describe('boards', function () {
    describe('methods', function () {
      beforeEach(function () {
        Boards.remove({});
        Users.remove({});
      });
      describe('boardsInsert', function () {
        // TODO: assert is name available
        // TODO: assert how insert adds additional props to board
        it('inserts data', function () {
          const user = Factory.create('user');
          boardsInsert._execute({ userId: user._id }, {
            name: 'name',
            description: 'description',
            isPrivate: false,
          });

          const board = Boards.findOne({ userId: user._id });
          assert.equal(board.name, 'name');
          assert.equal(board.description, 'description');
          assert.equal(board.isPrivate, false);
        });
        it('throws error if user is not logged in', function () {
          const params = {
            name: 'name',
            description: 'description',
            isPrivate: false,
          };

          assert.throws(() => {
            boardsInsert._execute({}, params);
          }, Meteor.Error, /Must be logged in to make a board./);
        });
      });
      describe('boardsUpdate', function () {
        // TODO: assert is name available
        // TODO: assert createdAt not changes when updates
        it('update data', function () {
          const user = Factory.create('user');
          const board = Factory.create('board', {
            userId: user._id,
            username: user.username,
          });
          const _id = board._id;
          const modifier = { $set: {
            name: 'new name',
            description: 'new description',
            isPrivate: true,
          } };

          boardsUpdate._execute({ userId: user._id }, { _id, modifier });
          const boardUpdated = Boards.findOne({ userId: user._id, name: 'new name' });
          assert.equal(boardUpdated.name, 'new name');
          assert.equal(boardUpdated.description, 'new description');
          assert.equal(boardUpdated.isPrivate, true);
        });
        it('throws error if user is not logged in', function () {
          const _id = Random.id();
          const modifier = { $set: {
            name: 'new name',
            description: 'new description',
            isPrivate: true,
          } };
          assert.throws(() => {
            boardsUpdate._execute({}, { _id, modifier });
          }, Meteor.Error, /Must be logged in to update a board./);
        });
        it('throws error if user has not access', function () {
          const board = Factory.create('board');
          const _id = board._id;
          const modifier = { $set: {
            name: 'new name',
            description: 'new description',
            isPrivate: true,
          } };

          assert.throws(() => {
            boardsUpdate._execute({ userId: Random.id() }, { _id, modifier });
          }, Meteor.Error, /You don't have permission to edit this board./);
        });
      });
    });
  });
}
