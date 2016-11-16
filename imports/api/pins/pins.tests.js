/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import Chance from 'chance';
import Pins from './pins.js';
import { pinsInsert } from './methods.js';

const chance = new Chance();

if (Meteor.isServer) {
  describe('pins', function () {
    describe('methods', function () {
      beforeEach(function () {
        resetDatabase();
      });
      describe('pinsInsert', function () {
        it('inserts data', function () {
          const user = Factory.create('user');
          const board = Factory.create('board', { userId: user._id, username: user.username });
          const params = {
            boardId: board._id,
            imageUrl: chance.url({ extensions: ['.jpg', '.gif', '.png'] }),
            description: 'description',
          };

          pinsInsert._execute({ userId: user._id }, params);
          const pin = Pins.findOne({ userId: user._id });
          assert.equal(pin.userId, user._id);
          assert.equal(pin.username, user.username);
          assert.equal(pin.boardId, board._id);
          assert.equal(pin.imageUrl, params.imageUrl);
          assert.equal(pin.description, 'description');
          assert.equal(pin.isPrivate, false);
        });
        it('throws error if board not exists', function () {
          const user = Factory.create('user');
          const params = {
            boardId: Random.id(),
            imageUrl: chance.url({ extensions: ['.jpg', '.gif', '.png'] }),
            description: 'description',
          };

          assert.throws(() => {
            pinsInsert._execute({ userId: user._id }, params);
          }, Meteor.Error, /Can't add a pin in a board that not exists./);
        });
        it('throws error if user is not logged in', function () {
          const params = {
            boardId: Random.id(),
            imageUrl: chance.url({ extensions: ['.jpg', '.gif', '.png'] }),
            description: 'description',
          };

          assert.throws(() => {
            pinsInsert._execute({}, params);
          }, Meteor.Error, /Must be logged in to make a pin./);
        });
      });
    });
  });
}
