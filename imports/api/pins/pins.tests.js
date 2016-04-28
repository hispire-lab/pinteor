/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { Random } from 'meteor/random';

if (Meteor.isServer) {
  describe('Pins.helpers', function () {
    describe('Pins.helpers.board', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should return the board in which the pin lives in', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.equal(pin.board()._id, board._id);
      });
    });
    describe('Pins.helpers.editableBy', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should be able to edit a pin that the user owns', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.equal(true, pin.editableBy(user._id));
      });
      it('should not be able to edit a pin that the user not owns', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.equal(false, pin.editableBy(Random.id()));
      });
    });
  });
}
