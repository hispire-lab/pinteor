/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { Boards } from './boards.js';

Factory.define('board', Boards, {
  name: 'board A',
  userId: Random.id(),
});

if (Meteor.isServer) {
  describe('Boards collection', function () {
    describe('Boards.insert', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should get board id on successfull insert', function () {
        const expectedBoardId = Random.id();
        const actualBoardId = Factory.create('board', {
          _id: expectedBoardId,
        })._id;

        chai.assert.equal(actualBoardId, expectedBoardId);
      });
      it('should create new date if no date exists', function () {
        const board = Factory.create('board');

        chai.assert.typeOf(board.createdAt, 'date');
      });
      it('should not create new date if date exists', function () {
        const expectedDate = new Date();
        const actualDate = Factory.create('board', {
          createdAt: expectedDate,
        }).createdAt;

        chai.assert.equal(actualDate.getTime(), expectedDate.getTime());
      });
    });
  });
}
