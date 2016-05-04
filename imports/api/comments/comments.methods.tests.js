/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { Comments } from './comments.js';

if (Meteor.isServer) {
  describe('Comments.methods', function () {
    describe('Comments.methods.insert', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not insert a new comment if user is not logged in', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.throws(() => {
          Comments.methods.insert._execute({}, {
            pinId: pin._id,
            text: faker.lorem.sentence(),
          });
        }, Meteor.Error, /Must be logged in to comment a pin./);
      });
      it('should not insert a new comment if the pin does not exists', function () {
        const user = Factory.create('user');

        chai.assert.throws(() => {
          Comments.methods.insert._execute({ userId: user._id }, {
            pinId: Random.id(),
            text: faker.lorem.sentence(),
          });
        }, Meteor.Error, /Cannot comment on a non existing pin./);
      });
      it('should not insert a new comment if the pin is private', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, isPrivate: true });
        const pin = Factory.create('pin', {
          userId: user._id,
          boardId: board._id,
          isPrivate: true,
        });

        chai.assert.throws(() => {
          Comments.methods.insert._execute({ userId: user._id }, {
            pinId: pin._id,
            text: faker.lorem.sentence(),
          });
        }, Meteor.Error, /Cannot comment on a private pin./);
      });
      it('should insert a new comment', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        const commentId = Comments.methods.insert._execute({ userId: user._id }, {
          pinId: pin._id,
          text: 'comment text',
        });

        const comment = Comments.findOne({ _id: commentId });
        chai.assert.equal(user._id, comment.authorId);
        chai.assert.equal(user.username, comment.authorName);
        chai.assert.equal(pin._id, comment.pinId);
        chai.assert.equal('comment text', comment.text);
      });
    });
    describe('Comments.methods.remove', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not remove a comment if user is not logged in', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });
        const comment = Factory.create('comment', {
          authorId: user._id,
          authorName: user.username,
          pinId: pin._id,
        });

        chai.assert.throws(() => {
          Comments.methods.remove._execute({}, { commentId: comment._id });
        }, Meteor.Error, /Must be logged in to remove a comment./);
      });
      it('should not remove a comment if the comment does not exists', function () {
        const user = Factory.create('user');

        chai.assert.throws(() => {
          Comments.methods.remove._execute({ userId: user._id }, { commentId: Random.id() });
        }, Meteor.Error, /Cannot remove a non existing comment./);
      });
      it('should remove a comment', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });
        const comment = Factory.create('comment', {
          authorId: user._id,
          authorName: user.username,
          pinId: pin._id,
        });

        Comments.methods.remove._execute({ userId: user._id }, { commentId: comment._id });

        chai.assert.isUndefined(Comments.findOne({ _id: comment._id }));
      });
    });
  });
}
