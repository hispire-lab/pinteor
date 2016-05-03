/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { Pins } from './pins.js';
import { Comments } from '../comments/comments.js';

if (Meteor.isServer) {
  describe('Pins.helpers', function () {
    describe('Pins.commentsCount', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should increase comments count when a new comment is inserted', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.equal(0, Pins.findOne({ _id: pin._id }).commentsCount);

        Comments.methods.insert._execute({ userId: user._id }, {
          pinId: pin._id,
          text: faker.lorem.sentence(),
        });
        chai.assert.equal(1, Pins.findOne({ _id: pin._id }).commentsCount);

        Comments.methods.insert._execute({ userId: user._id }, {
          pinId: pin._id,
          text: faker.lorem.sentence(),
        });
        chai.assert.equal(2, Pins.findOne({ _id: pin._id }).commentsCount);

        Comments.methods.insert._execute({ userId: user._id }, {
          pinId: pin._id,
          text: faker.lorem.sentence(),
        });
        chai.assert.equal(3, Pins.findOne({ _id: pin._id }).commentsCount);
      });
      it('should decrease comments count when a comment is removed', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });
        const comment1 = Factory.create('comment', {
          authorId: user._id,
          authorName: user.username,
          pinId: pin._id,
        });
        const comment2 = Factory.create('comment', {
          authorId: user._id,
          authorName: user.username,
          pinId: pin._id,
        });
        const comment3 = Factory.create('comment', {
          authorId: user._id,
          authorName: user.username,
          pinId: pin._id,
        });

        chai.assert.equal(3, Pins.findOne({ _id: pin._id }).commentsCount);

        Comments.methods.remove._execute({ userId: user._id }, { commentId: comment1._id });
        chai.assert.equal(2, Pins.findOne({ _id: pin._id }).commentsCount);

        Comments.methods.remove._execute({ userId: user._id }, { commentId: comment2._id });
        chai.assert.equal(1, Pins.findOne({ _id: pin._id }).commentsCount);

        Comments.methods.remove._execute({ userId: user._id }, { commentId: comment3._id });
        chai.assert.equal(0, Pins.findOne({ _id: pin._id }).commentsCount);
      });
    });
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
