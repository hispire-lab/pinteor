/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Pins } from './pins.js';
import { Boards } from '../boards/boards.js';
import { insert, setPinData, move } from './methods.js';

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

Factory.define('pin', Pins, {
  imgUrl: faker.image.imageUrl(),
  createdAt: new Date(),
  boardId: Random.id(),
});


if (Meteor.isServer) {
  describe('Pins.methods', function () {
    describe('Pins.methods.insert', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should insert a pin in a board when the user is logged in', function () {
        const userId = Random.id();
        const board = Factory.create('board', { userId });

        const pinId = insert._execute({ userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });
        /*
         * FIXME:
         * instead of checking the type of boardId against the string type,
         * will be better if we check it against simpleSchema id regex.
         */
        chai.assert.typeOf(pinId, 'string');
      });
      it('should not insert a pin in a board when the user is not logged in', function () {
        const board = Factory.create('board');

        chai.assert.throws(() => {
          insert._execute({}, {
            boardId: board._id,
            imgUrl: faker.image.imageUrl(),
          });
        }, Meteor.Error, /Must be logged in to insert a pin./);
      });
      it('should not insert a pin in a board when the user is not owner', function () {
        const userId = Random.id();
        const board = Factory.create('board');

        chai.assert.throws(() => {
          insert._execute({ userId }, {
            boardId: board._id,
            imgUrl: faker.image.imageUrl(),
          });
        }, Meteor.Error, /Cannot add a pin to a board that is not yours./);
      });
      it('should create new date if no date exists', function () {
        const userId = Random.id();
        const board = Factory.create('board', { userId });

        const pinId = insert._execute({ userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.typeOf(Pins.findOne({ _id: pinId }).createdAt, 'date');
      });
      it('should make private a pin if his board is private', function () {
        const userId = Random.id();
        const board = Factory.create('board', { userId, isPrivate: true });

        const pinId = insert._execute({ userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.equal(true, Pins.findOne({ _id: pinId }).isPrivate);
      });
      it('should make public a pin if his board is public', function () {
        const userId = Random.id();
        const board = Factory.create('board', { userId, isPrivate: false });

        const pinId = insert._execute({ userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.equal(false, Pins.findOne({ _id: pinId }).isPrivate);
      });
      /*
       * this test should be moved to the update method, only makes sense
       * to test that createdAt date not changes when we update a pin
       */
      it.skip('should not create new date if date exists', function () {
        const userId = Random.id();
        const board = Factory.create('board', { userId });
        const pin = Factory.create('pin', { boardId: board._id });
        const expectedDate = pin.createdAt;

        const pinId = insert._execute({ userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
          createdAt: expectedDate - 1000,
        });

        chai.assert.equal(Pins.findOne({ _id: pinId }).createdAt.getTime(), expectedDate.getTime());
      });
    });
    describe('Pins.methods.setPinData', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not be able to edit pin data if user is not logged in', function () {
        const board = Factory.create('board');
        const pinId = Factory.create('pin', { boardId: board._id })._id;
        const fieldsToSet = {
          imgUrl: faker.image.imageUrl(),
        };

        chai.assert.throws(() => {
          setPinData._execute({}, { pinId, fieldsToSet });
        }, Meteor.Error, /Must be logged in to edit pin data./);
      });
      it('should not be able to set pin data if user not owns pin', function () {
        const userId = Random.id();
        const board = Factory.create('board');
        const pinId = Factory.create('pin', { boardId: board._id })._id;
        const fieldsToSet = {
          imgUrl: faker.image.imageUrl(),
        };

        chai.assert.throws(() => {
          setPinData._execute({ userId }, { pinId, fieldsToSet });
        }, Meteor.Error, /Cannot edit a pin that is not yours./);
      });
      it('should be able to edit pin data if user owns the pin', function () {
        const userId = Random.id();
        const board = Factory.create('board', { userId });
        const pinId = Factory.create('pin', { boardId: board._id })._id;
        const fieldsToSet = {
          imgUrl: faker.image.imageUrl(),
        };

        setPinData._execute({ userId }, { pinId, fieldsToSet });

        const pin = Pins.findOne({ _id: pinId });
        chai.assert.equal(fieldsToSet.imgUrl, pin.imgUrl);
      });
    });
    describe('Pins.methods.move', function () {
      beforeEach(function () {
        resetDatabase();
      });
      /*
       * TODO:
       * write tests for erros throwed by Pins.methods.move
       */
      it('should move a pin to another board and set privacy equal to new board', function () {
        const userId = Random.id();
        const fromBoard = Factory.create('board', {
          userId,
          name: 'from board',
          isPrivate: false,
        });
        const toBoard = Factory.create('board', {
          userId,
          name: 'to board',
          isPrivate: true,
        });
        const pinId = Factory.create('pin', { boardId: fromBoard._id })._id;

        move._execute({ userId }, { pinId, boardId: toBoard._id });

        const movedPin = Pins.findOne({ _id: pinId });
        chai.assert.equal(toBoard._id, movedPin.boardId);
        chai.assert.equal(toBoard.isPrivate, movedPin.isPrivate);
      });
    });
  });
}
