/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
// Note: slug and simple schema config files should be
// imported in some kind of test config file.
import '../../startup/both/slug-config.js';
import '../../startup/both/simpleSchema-custom-messages.js';
import Boards from './boards.js';
import { boardsInsert, boardsUpdate } from './methods.js';

if (Meteor.isServer) {
  describe('boards', function () {
    // TODO: test isSlugAvailable method
    describe('methods', function () {
      beforeEach(function () {
        resetDatabase();
      });
      describe('boardsInsert', function () {
        // TODO: assert two different users can have the same board name
        // TODO: assert is name available
        it('inserts data', function () {
          // TODO: assert createdAt
          const user = Factory.create('user');
          boardsInsert._execute({ userId: user._id }, {
            name: 'name',
            description: 'description',
            isPrivate: false,
          });

          const board = Boards.findOne({ userId: user._id });
          assert.equal(board.userId, user._id);
          assert.equal(board.username, user.username);
          assert.equal(board.name, 'name');
          assert.equal(board.slug, 'name');
          assert.equal(board.description, 'description');
          assert.equal(board.isPrivate, false);
          assert.isString(board.imageUrl);
        });
        it('throws error if name is not available', function () {
          const user = Factory.create('user');
          Factory.create('board', {
            userId: user._id,
            username: user.username,
            name: 'board A',
          });

          const params = {
            name: 'board a',
            description: 'description',
            isPrivate: false,
          };
          // Note: i don't know what kind of error simple schema
          // triggers for custom validation, i tested it and the
          // error is not either Meteor.Error or ValidationError
          // so i matched against a generic Error type
          assert.throws(() => {
            boardsInsert._execute({ userId: user._id }, params);
          }, Error, 'Name is not available.');
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
        // TODO: assert two different users can have the same board name
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
        it('throws error if name is not available', function () {
          const user = Factory.create('user');
          Factory.create('board', {
            // _id: Random.id(),
            userId: user._id,
            username: user.username,
            name: 'board A',
          });
          const boardB = Factory.create('board', {
            // _id: Random.id(),
            userId: user._id,
            username: user.username,
            name: 'board B',
          });
          const _id = boardB._id;
          const modifier = { $set: {
            name: 'board-a',
            description: 'new description',
            isPrivate: true,
          } };

          assert.throws(() => {
            boardsUpdate._execute({ userId: user._id }, { _id, modifier });
          }, Error, 'Name is not available.');
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
