/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { Random } from 'meteor/random';

if (Meteor.isServer) {
  describe('Boards.helpers', function () {
    describe('Boards.helpers.editableBy', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should be able to edit a board that the user owns', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        chai.assert.equal(true, board.editableBy(user._id));
      });
      it('should not be able to edit a board that the user not owns', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        chai.assert.equal(false, board.editableBy(Random.id()));
      });
    });
  });
}
