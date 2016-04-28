/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { Users } from './users.js';
import { like, unlike } from '../pins/methods.js';

if (Meteor.isServer) {
  describe('Users', function () {
    describe('Users.likesCount', function () {
      /*
       * TODO: add test for Users.likesCount with more than one board.
       */
      beforeEach(function () {
        resetDatabase();
      });
      it('should increase likes count when different pins are liked', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin1 = Factory.create('pin', { userId: user._id, boardId: board._id });
        const pin2 = Factory.create('pin', { userId: user._id, boardId: board._id });
        const pin3 = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: user._id }, { pinId: pin1._id });
        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: user._id }, { pinId: pin2._id });
        chai.assert.equal(2, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: user._id }, { pinId: pin3._id });
        chai.assert.equal(3, Users.findOne({ _id: user._id }).likesCount);
      });
      it('should increase likes count just once when same pins are liked', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: user._id }, { pinId: pin._id });
        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: user._id }, { pinId: pin._id });
        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: user._id }, { pinId: pin._id });
        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);
      });
      it('should decrease likes count when different pins are unliked', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin1 = Factory.create('pin', { userId: user._id, boardId: board._id });
        const pin2 = Factory.create('pin', { userId: user._id, boardId: board._id });
        const pin3 = Factory.create('pin', { userId: user._id, boardId: board._id });

        like._execute({ userId: user._id }, { pinId: pin1._id });
        like._execute({ userId: user._id }, { pinId: pin2._id });
        like._execute({ userId: user._id }, { pinId: pin3._id });

        chai.assert.equal(3, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: user._id }, { pinId: pin1._id });
        chai.assert.equal(2, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: user._id }, { pinId: pin2._id });
        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: user._id }, { pinId: pin3._id });
        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);
      });
      it('should decrease likes count just once when same pins are unliked', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        like._execute({ userId: user._id }, { pinId: pin._id });

        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: user._id }, { pinId: pin._id });
        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: user._id }, { pinId: pin._id });
        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: user._id }, { pinId: pin._id });
        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);
      });
    });
  });
}
