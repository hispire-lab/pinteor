/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Boards } from './boards.js';

Factory.define('board', Boards, {
  name: 'board A',
  description: faker.lorem.sentence(),
  createdAt: new Date(),
  userId: Random.id(),
  isPrivate: false,
});

if (Meteor.isServer) {
  describe('Boards.helpers', function () {
    describe('Boards.helpers.editableBy', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should be able to edit a board that the user owns', function () {
        const userId = Random.id();
        const board = Factory.create('board', { userId });

        chai.assert.equal(true, board.editableBy(userId));
      });
      it('should not be able to edit a board that the user not owns', function () {
        const board = Factory.create('board');

        chai.assert.equal(false, board.editableBy(Random.id()));
      });
    });
  });
}
