/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Boards } from '../boards/boards.js';
import { Pins } from './pins.js';

Factory.define('board', Boards, {
  name: 'board A',
  description: faker.lorem.sentence(),
  createdAt: new Date(),
  userId: Random.id(),
  isPrivate: false,
});

Factory.define('pin', Pins, {
  imgUrl: faker.image.imageUrl(),
  createdAt: new Date(),
  boardId: Random.id(),
});

if (Meteor.isServer) {
  describe('Pins.helpers', function () {
    describe('Pins.helpers.editableBy', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should be able to edit a pin that the user owns', function () {
        const userId = Random.id();
        const boardId = Factory.create('board', { userId })._id;
        const pin = Factory.create('pin', { boardId });

        chai.assert.equal(true, pin.editableBy(userId));
      });
      it('should not be able to edit a pin that the user not owns', function () {
        const board = Factory.create('board');
        const pin = Factory.create('pin', { boardId: board._id });

        chai.assert.equal(false, pin.editableBy(Random.id()));
      });
    });
  });
}
