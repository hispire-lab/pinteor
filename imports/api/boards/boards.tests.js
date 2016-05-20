/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Boards } from './boards.js';
import { insert as pinInsert, remove as pinRemove } from '../pins/methods.js';

if (Meteor.isServer) {
  describe('Boards.helpers', function () {
    /*
     * FIXME: should i move this to pins.tests ?
     */
    describe('Pins.commentsCount', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should increase pins count when a new pin is inserted', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        chai.assert.equal(0, Boards.findOne({ _id: board._id }).pinsCount);

        pinInsert._execute({ userId: user._id }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });
        chai.assert.equal(1, Boards.findOne({ _id: board._id }).pinsCount);

        pinInsert._execute({ userId: user._id }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });
        chai.assert.equal(2, Boards.findOne({ _id: board._id }).pinsCount);

        pinInsert._execute({ userId: user._id }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });
        chai.assert.equal(3, Boards.findOne({ _id: board._id }).pinsCount);
      });
      it('should decrease pins count when a pin is removed', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin1 = Factory.create('pin', { userId: user._id, boardId: board._id });
        const pin2 = Factory.create('pin', { userId: user._id, boardId: board._id });
        const pin3 = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.equal(3, Boards.findOne({ _id: board._id }).pinsCount);

        pinRemove._execute({ userId: user._id }, { pinId: pin1._id });
        chai.assert.equal(2, Boards.findOne({ _id: board._id }).pinsCount);

        pinRemove._execute({ userId: user._id }, { pinId: pin2._id });
        chai.assert.equal(1, Boards.findOne({ _id: board._id }).pinsCount);

        pinRemove._execute({ userId: user._id }, { pinId: pin3._id });
        chai.assert.equal(0, Boards.findOne({ _id: board._id }).pinsCount);
      });
    });
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
