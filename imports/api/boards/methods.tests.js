/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Pins } from '../pins/pins.js';
import { Boards } from './boards.js';
import { insert, setPrivate, remove } from './methods.js';

/*
 * FIXME:
 * is not a good idea to define the factories here, in the sample todo app
 * the factories are defined in the collection file, like in boards.js, seems
 * like this is either a good choice because that code will be deployed on
 * production, could be a nice idea to move the definition of factories to is
 * own file in order to be loaded just for testing purposes.
 *
 * FIXME:
 * seems like factories creates object without passing the schema.
 */
Factory.define('board', Boards, {
  name: 'board A',
  description: faker.lorem.sentence(),
  createdAt: new Date(),
  userId: Random.id(),
  isPrivate: false,
});

Factory.define('pin', Pins, {
  title: faker.name.title(),
  imgUrl: faker.image.imageUrl(),
  createdAt: new Date(),
  boardId: Random.id(),
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
    describe('Boards.methods.setPrivate', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not make private a board when the user is not logged', function () {
        const boardId = Factory.create('board')._id;

        chai.assert.throws(() => {
          setPrivate._execute({}, { isPrivate: true, boardId });
        }, Meteor.Error, /Must be logged in to make private a board./);
      });
      it('should not make private a board when the user is not owner', function () {
        const boardId = Factory.create('board')._id;
        // this user id is different to the userId created by the factory.
        const userId = Random.id();

        chai.assert.throws(() => {
          setPrivate._execute({ userId }, { isPrivate: true, boardId });
        }, Meteor.Error, /Cannot make private a board that is not yours./);
      });
      it('should make private a public board when the user is logged and is owner', function () {
        const board = Factory.create('board');
        setPrivate._execute({ userId: board.userId }, { isPrivate: true, boardId: board._id });

        chai.assert.equal(true, Boards.findOne({ _id: board._id }).isPrivate);
      });
      it('should make private a private board when the user is logged and is owner', function () {
        const board = Factory.create('board', { isPrivate: true });
        setPrivate._execute({ userId: board.userId }, { isPrivate: true, boardId: board._id });

        chai.assert.equal(true, Boards.findOne({ _id: board._id }).isPrivate);
      });
      it('should make private all pins when make private a public board', function () {
        const board = Factory.create('board');
        const pin = Factory.create('pin', { boardId: board._id });

        setPrivate._execute({ userId: board.userId }, { isPrivate: true, boardId: board._id });

        chai.assert.equal(true, Pins.findOne({ _id: pin._id }).isPrivate);
      });
      it('should make public all pins when make public a private board', function () {
        const board = Factory.create('board', { isPrivate: true });
        const pin = Factory.create('pin', { boardId: board._id, isPrivate: true });

        setPrivate._execute({ userId: board.userId }, { isPrivate: false, boardId: board._id });

        chai.assert.equal(false, Pins.findOne({ _id: pin._id }).isPrivate);
      });
    });
    describe('Boards.methods.remove', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not be able to remove a board when the user is not logged in', function () {
        const boardId = Factory.create('board')._id;

        chai.assert.throws(() => {
          remove._execute({}, { boardId });
        }, Meteor.Error, /Must be logged in to remove a board./);
      });
      it('should not be able to remove a board when the user is not owner', function () {
        const userId = Random.id();
        const boardId = Factory.create('board')._id;

        chai.assert.throws(() => {
          remove._execute({ userId }, { boardId });
        }, Meteor.Error, /Cannot remove a board that is not yours./);
      });
      it('should be able to remove a board when the user is owner', function () {
        const userId = Random.id();
        const boardId = Factory.create('board', { userId })._id;

        remove._execute({ userId }, { boardId });

        chai.assert.isUndefined(Boards.findOne({ _id: boardId }));
      });
      it('should remove pins inside board when remove a board', function () {
        const userId = Random.id();
        const boardId = Factory.create('board', { userId })._id;
        const pinId1 = Factory.create('pin', { title: 'pin 1', boardId })._id;
        const pinId2 = Factory.create('pin', { title: 'pin 2', boardId })._id;

        remove._execute({ userId }, { boardId });

        chai.assert.isUndefined(Pins.findOne({ _id: pinId1 }));
        chai.assert.isUndefined(Pins.findOne({ _id: pinId2 }));
      });
    });
  });
}
