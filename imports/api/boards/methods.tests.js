/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Boards } from './boards.js';
import { insert, makePrivate } from './methods.js';

/*
 * FIXME:
 * is not a good idea to define the factories here, in the sample todo app
 * the factories are defined in the collection file, like in boards.js, seems
 * like this is either a good choice because that code will be deployed on
 * production, could be a nice idea to move the definition of factories to is
 * own file in order to be loaded just for testing purposes.
 */
Factory.define('board', Boards, {
  name: 'board A',
  description: faker.lorem.sentence(),
  createdAt: new Date(),
  userId: Random.id(),
  isPrivate: false,
});

if (Meteor.isServer) {
  describe('Boards.methods', function () {
    describe('Boards.methods.insert', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should get board id on successfull insert', function () {
        const actualBoardId = insert._execute({ userId: Random.id() }, {
          name: 'board A',
        });
        /*
         * FIXME:
         * instead of checking the type of boardId against the string type,
         * will be better if we check it against simpleSchema id regex.
         */
        chai.assert.typeOf(actualBoardId, 'string');
      });
      it('should throw an error when user is not logged in', function () {
        chai.assert.throws(() => {
          insert._execute({}, { name: 'board A' });
        }, Meteor.Error, /Must be logged in to create a board./);
      });
      it('should create new date if no date exists', function () {
        const board = Factory.create('board', {
          createdAt: undefined,
        });

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
    describe('Boards.methods.makePrivate', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not make private a board when the user is not logged', function () {
        const boardId = Factory.create('board')._id;
        chai.assert.throws(() => {
          makePrivate._execute({}, { boardId });
        }, Meteor.Error, /Must be logged in to make private a board./);
      });
      it('should not make private a board when the user is not owner', function () {
        const boardId = Factory.create('board')._id;
        // this user id is different to the userId created by the factory.
        const userId = Random.id();
        chai.assert.throws(() => {
          makePrivate._execute({ userId }, { boardId });
        }, Meteor.Error, /Cannot make private a board that is not yours./);
      });
      it('should make private a public board when the user is logged and is owner', function () {
        const board = Factory.create('board');
        makePrivate._execute({ userId: board.userId }, { boardId: board._id });

        chai.assert.equal(true, Boards.findOne({ _id: board._id }).isPrivate);
      });
      it('should make private a private board when the user is logged and is owner', function () {
        const board = Factory.create('board', { isPrivate: true });
        makePrivate._execute({ userId: board.userId }, { boardId: board._id });

        chai.assert.equal(true, Boards.findOne({ _id: board._id }).isPrivate);
      });
    });
  });
}
