/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { stubInsertNotification } from '../stubs.tests.js';
import { Pins } from './pins.js';
import { insert, remove, setPinData, move, copy, save, like, unlike } from './methods.js';

if (Meteor.isServer) {
  describe('Pins.methods', function () {
    describe('Pins.methods.insert', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should insert a pin in a board when the user is logged in', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute(
          { userId: board.userId },
          {
            boardId: board._id,
            imgUrl: faker.image.imageUrl(),
          }
        );

        /*
         * FIXME: instead of checking the type of boardId against the string type,
         * will be better if we check it against simpleSchema id regex.
         */
        chai.assert.typeOf(pinId, 'string');
      });
      it('should not insert a pin in a board when the user is not logged in', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        chai.assert.throws(() => {
          insert._execute({}, {
            boardId: board._id,
            imgUrl: faker.image.imageUrl(),
          });
        }, Meteor.Error, /Must be logged in to insert a pin./);
      });
      it('should not insert a pin in a board when the user is not owner', function () {
        const userNotOwner = Factory.create('user', { username: faker.internet.userName() });
        const userOwner = Factory.create('user');
        const board = Factory.create('board', { userId: userOwner._id });

        chai.assert.throws(() => {
          insert._execute({ userId: userNotOwner._id }, {
            boardId: board._id,
            imgUrl: faker.image.imageUrl(),
          });
        }, Meteor.Error, /Cannot add a pin to a board that is not yours./);
      });
      it('should create new date if no date exists', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.typeOf(Pins.findOne({ _id: pinId }).createdAt, 'date');
      });
      it('should make private a pin if his board is private', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, isPrivate: true });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.equal(true, Pins.findOne({ _id: pinId }).isPrivate);
      });
      it('should make public a pin if his board is public', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, isPrivate: false });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.equal(false, Pins.findOne({ _id: pinId }).isPrivate);
      });
    });
    describe('Pins.methods.remove', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not remove a pin if user is not logged in', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.throws(() => {
          remove._execute({}, { pinId: pin._id });
        }, Meteor.Error, /Must be logged in to remove a pin./);
      });
      it('should not remove a pin if the pin does not exists', function () {
        const user = Factory.create('user');

        chai.assert.throws(() => {
          remove._execute({ userId: user._id }, { pinId: Random.id() });
        }, Meteor.Error, /Cannot remove a non existing pin./);
      });
      it('should remove a pin', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        remove._execute({ userId: user._id }, { pinId: pin._id });

        chai.assert.isUndefined(Pins.findOne({ _id: pin._id }));
      });
    });
    describe('Pins.methods.setPinData', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not be able to edit pin data if user is not logged in', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });
        const fieldsToSet = {
          imgUrl: faker.image.imageUrl(),
        };

        chai.assert.throws(() => {
          setPinData._execute({}, { pinId, fieldsToSet });
        }, Meteor.Error, /Must be logged in to edit pin data./);
      });
      it('should not be able to set pin data if user not owns pin', function () {
        const userNotOwner = Factory.create('user', { username: faker.internet.userName() });
        const userOwner = Factory.create('user');
        const board = Factory.create('board', { userId: userOwner._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });
        const fieldsToSet = {
          imgUrl: faker.image.imageUrl(),
        };

        chai.assert.throws(() => {
          setPinData._execute({ userId: userNotOwner._id }, { pinId, fieldsToSet });
        }, Meteor.Error, /Cannot edit a pin that is not yours./);
      });
      it('should be able to edit pin data if user owns the pin', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });
        const fieldsToSet = {
          imgUrl: faker.image.imageUrl(),
        };

        setPinData._execute({ userId: board.userId }, { pinId, fieldsToSet });

        chai.assert.equal(
          fieldsToSet.imgUrl,
          Pins.findOne({ _id: pinId }).imgUrl
        );
      });
    });
    describe('Pins.methods.move', function () {
      beforeEach(function () {
        resetDatabase();
      });
      /*
       * TODO: write tests for erros throwed by Pins.methods.move
       */
      it('should move a pin to another board and set privacy equal to new board', function () {
        const user = Factory.create('user');
        const fromBoard = Factory.create('board', {
          userId: user._id,
          name: 'from board',
          isPrivate: false,
        });
        const toBoard = Factory.create('board', {
          userId: user._id,
          name: 'to board',
          isPrivate: true,
        });
        const pinId = insert._execute({ userId: fromBoard.userId }, {
          boardId: fromBoard._id,
          imgUrl: faker.image.imageUrl(),
        });
        move._execute({ userId: fromBoard.userId }, { pinId, boardId: toBoard._id });

        const movedPin = Pins.findOne({ _id: pinId });
        chai.assert.equal(toBoard._id, movedPin.boardId);
        chai.assert.equal(toBoard.isPrivate, movedPin.isPrivate);
      });
    });
    describe('Pins.methods.copy', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not be able to copy a pin if user is not logged in', function () {
        const user = Factory.create('user');
        const fromBoard = Factory.create('board', {
          userId: user._id,
          name: 'from board',
          isPrivate: false,
        });
        const toBoard = Factory.create('board', {
          userId: user._id,
          name: 'to board',
          isPrivate: true,
        });
        const fromPinId = insert._execute({ userId: fromBoard.userId }, {
          boardId: fromBoard._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.throws(() => {
          copy._execute({}, { pinId: fromPinId, boardId: toBoard._id });
        }, Meteor.Error, /Must be logged in to copy a pin./);
      });
      it('should not be able to copy a pin if user is not owner', function () {
        const userNotOwner = Factory.create('user', { username: faker.internet.userName() });
        const userOwner = Factory.create('user');
        const fromBoard = Factory.create('board', {
          userId: userOwner._id,
          name: 'from board',
          isPrivate: false,
        });
        const toBoard = Factory.create('board', {
          userId: userOwner._id,
          name: 'to board',
          isPrivate: true,
        });
        const fromPinId = insert._execute({ userId: fromBoard.userId }, {
          boardId: fromBoard._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.throws(() => {
          copy._execute({ userId: userNotOwner._id }, { pinId: fromPinId, boardId: toBoard._id });
        }, Meteor.Error, /Cannot copy a pin that is not yours./);
      });
      it('should not be able to copy a pin to a board that the user not owns', function () {
        const userNotOwner = Factory.create('user', { username: faker.internet.userName() });
        const userOwner = Factory.create('user');
        const fromBoard = Factory.create('board', {
          userId: userOwner._id,
          name: 'from board',
          isPrivate: false,
        });
        const toBoard = Factory.create('board', {
          userId: userNotOwner._id,
          name: 'to board',
          isPrivate: true,
        });
        const fromPinId = insert._execute({ userId: fromBoard.userId }, {
          boardId: fromBoard._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.throws(() => {
          copy._execute({ userId: fromBoard.userId }, { pinId: fromPinId, boardId: toBoard._id });
        }, Meteor.Error, /Cannot copy a pin to a board that is not yours./);
      });
      it('should copy a pin to another board', function () {
        const user = Factory.create('user');
        const fromBoard = Factory.create('board', {
          userId: user._id,
          name: 'from board',
          isPrivate: false,
        });
        const toBoard = Factory.create('board', {
          userId: user._id,
          name: 'to board',
          isPrivate: true,
        });
        const fromPinId = insert._execute({ userId: fromBoard.userId }, {
          boardId: fromBoard._id,
          imgUrl: faker.image.imageUrl(),
        });

        const fromPin = Pins.findOne({ _id: fromPinId });
        const copiedPinId = copy._execute(
          { userId: fromBoard.userId },
          { pinId: fromPinId, boardId: toBoard._id }
        );

        const copiedPin = Pins.findOne({ _id: copiedPinId });
        chai.assert.notEqual(fromPin._id, copiedPin._id);
        chai.assert.equal(fromPin.imgUrl, copiedPin.imgUrl);
        chai.assert.equal(fromPin.description, copiedPin.description);
        chai.assert.equal(toBoard.isPrivate, copiedPin.isPrivate);
      });
      it('should copy a pin to same board', function () {
        const user = Factory.create('user');
        const fromBoard = Factory.create('board', {
          userId: user._id,
          name: 'from board',
          isPrivate: true,
        });
        const fromPinId = insert._execute({ userId: fromBoard.userId }, {
          boardId: fromBoard._id,
          imgUrl: faker.image.imageUrl(),
        });
        const copiedPinId = copy._execute({ userId: fromBoard.userId }, {
          pinId: fromPinId,
          boardId: fromBoard._id,
        });

        const fromPin = Pins.findOne({ _id: fromPinId });
        const copiedPin = Pins.findOne({ _id: copiedPinId });
        chai.assert.notEqual(fromPin._id, copiedPin._id);
        chai.assert.equal(fromPin.boardId, copiedPin.boardId);
        chai.assert.equal(fromPin.imgUrl, copiedPin.imgUrl);
        chai.assert.equal(fromPin.description, copiedPin.description);
        chai.assert.equal(fromBoard.isPrivate, copiedPin.isPrivate);
      });
    });
    describe('Pins.methods.save', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not be able to save a pin if user is not logged in', function () {
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const fromBoard = Factory.create('board', {
          userId: user._id,
          name: 'from board',
          isPrivate: false,
        });
        const toBoard = Factory.create('board', {
          userId: userAnother._id,
          name: 'to board',
          isPrivate: true,
        });
        const fromPinId = insert._execute({ userId: user._id }, {
          boardId: fromBoard._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.throws(() => {
          save._execute({}, { pinId: fromPinId, boardId: toBoard._id });
        }, Meteor.Error, /Must be logged in to save a pin./);
      });
      it('should not be able to save a pin if user is owner', function () {
        const userOwner = Factory.create('user');
        const fromBoard = Factory.create('board', {
          userId: userOwner._id,
          name: 'from board',
          isPrivate: false,
        });
        const toBoard = Factory.create('board', {
          userId: userOwner._id,
          name: 'to board',
          isPrivate: true,
        });
        const fromPinId = insert._execute({ userId: userOwner._id }, {
          boardId: fromBoard._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.throws(() => {
          save._execute({ userId: userOwner._id }, { pinId: fromPinId, boardId: toBoard._id });
        }, Meteor.Error, /Cannot save your own pin./);
      });
      it('should not be able to save a pin to a board that the user not owns', function () {
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const fromBoard = Factory.create('board', {
          userId: user._id,
          name: 'from board',
          isPrivate: false,
        });
        const toBoard = Factory.create('board', {
          userId: user._id,
          name: 'to board',
          isPrivate: true,
        });
        const fromPinId = insert._execute({ userId: user._id }, {
          boardId: fromBoard._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.throws(() => {
          save._execute({ userId: userAnother._id }, { pinId: fromPinId, boardId: toBoard._id });
        }, Meteor.Error, /Cannot save a pin to a board that is not yours./);
      });
      it('should save a pin to a board', function () {
        const insertNotificationStub = stubInsertNotification();
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const fromBoard = Factory.create('board', {
          userId: user._id,
          name: 'from board',
          isPrivate: false,
        });
        const toBoard = Factory.create('board', {
          userId: userAnother._id,
          name: 'to board',
          isPrivate: true,
        });
        const fromPinId = insert._execute({ userId: user._id }, {
          boardId: fromBoard._id,
          imgUrl: faker.image.imageUrl(),
        });

        const fromPin = Pins.findOne({ _id: fromPinId });
        const copiedPinId = save._execute(
          { userId: userAnother._id },
          { pinId: fromPinId, boardId: toBoard._id }
        );

        const copiedPin = Pins.findOne({ _id: copiedPinId });
        chai.assert.notEqual(fromPin._id, copiedPin._id);
        chai.assert.equal(fromPin.imgUrl, copiedPin.imgUrl);
        chai.assert.equal(fromPin.description, copiedPin.description);
        chai.assert.equal(toBoard.isPrivate, copiedPin.isPrivate);

        insertNotificationStub.restore();
      });
    });
    describe('Pins.methods.like', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not like a pin if user is not logged in', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.throws(() => {
          like._execute({}, { pinId });
        }, Meteor.Error, /Must be logged in to like a pin./);
      });
      it('should not like a a non existing pin', function () {
        const user = Factory.create('user');

        chai.assert.throws(() => {
          like._execute({ userId: user._id }, { pinId: Random.id() });
        }, Meteor.Error, /Cannot like a non existing pin./);
      });
      it('should like a pin.', function () {
        const insertNotificationStub = stubInsertNotification();
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });
        const isTrue = like._execute({ userId: userAnother._id }, { pinId });

        chai.assert.equal(true, isTrue);
        chai.assert.equal(
          Pins.findOne({ _id: pinId, likes: userAnother._id })._id,
          pinId
        );

        insertNotificationStub.restore();
      });
      it('should increase likes count when different users likes a pin', function () {
        const insertNotificationStub = stubInsertNotification();
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.equal(0, Pins.findOne({ _id: pinId }).likesCount);

        like._execute({ userId: Random.id() }, { pinId });
        chai.assert.equal(1, Pins.findOne({ _id: pinId }).likesCount);

        like._execute({ userId: Random.id() }, { pinId });
        chai.assert.equal(2, Pins.findOne({ _id: pinId }).likesCount);

        like._execute({ userId: Random.id() }, { pinId });
        chai.assert.equal(3, Pins.findOne({ _id: pinId }).likesCount);

        insertNotificationStub.restore();
      });
      it('should increase likes count once when same user likes a pin many times', function () {
        const insertNotificationStub = stubInsertNotification();
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.equal(0, Pins.findOne({ _id: pinId }).likesCount);

        like._execute({ userId: userAnother._id }, { pinId });
        chai.assert.equal(1, Pins.findOne({ _id: pinId }).likesCount);

        like._execute({ userId: userAnother._id }, { pinId });
        chai.assert.equal(1, Pins.findOne({ _id: pinId }).likesCount);

        like._execute({ userId: userAnother._id }, { pinId });
        chai.assert.equal(1, Pins.findOne({ _id: pinId }).likesCount);

        insertNotificationStub.restore();
      });
    });
    describe('Pins.methods.unlike', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not unlike a pin if user is not logged in', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        chai.assert.throws(() => {
          unlike._execute({}, { pinId });
        }, Meteor.Error, /Must be logged in to unlike a pin./);
      });
      it('should not unlike a a non existing pin', function () {
        const user = Factory.create('user');

        chai.assert.throws(() => {
          unlike._execute({ userId: user._id }, { pinId: Random.id() });
        }, Meteor.Error, /Cannot unlike a non existing pin./);
      });
      it('should unlike a pin.', function () {
        const insertNotificationStub = stubInsertNotification();
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });
        like._execute({ userId: userAnother._id }, { pinId });

        const isTrue = unlike._execute({ userId: userAnother._id }, { pinId });
        chai.assert.equal(true, isTrue);
        chai.assert.isUndefined(Pins.findOne({ _id: pinId, likes: userAnother._id }));

        insertNotificationStub.restore();
      });
      it('should decrease likes count when different users unlikes a pin', function () {
        const insertNotificationStub = stubInsertNotification();
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });

        const user1 = Factory.create('user', { username: faker.internet.userName() });
        const user2 = Factory.create('user', { username: faker.internet.userName() });
        const user3 = Factory.create('user', { username: faker.internet.userName() });
        like._execute({ userId: user1._id }, { pinId });
        like._execute({ userId: user2._id }, { pinId });
        like._execute({ userId: user3._id }, { pinId });

        chai.assert.equal(3, Pins.findOne({ _id: pinId }).likesCount);

        unlike._execute({ userId: user1._id }, { pinId });
        chai.assert.equal(2, Pins.findOne({ _id: pinId }).likesCount);

        unlike._execute({ userId: user2._id }, { pinId });
        chai.assert.equal(1, Pins.findOne({ _id: pinId }).likesCount);

        unlike._execute({ userId: user3._id }, { pinId });
        chai.assert.equal(0, Pins.findOne({ _id: pinId }).likesCount);

        insertNotificationStub.restore();
      });
      it('should decrease likes count once when same user unlikes a pin many times', function () {
        const insertNotificationStub = stubInsertNotification();
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        const pinId = insert._execute({ userId: board.userId }, {
          boardId: board._id,
          imgUrl: faker.image.imageUrl(),
        });
        const user1 = Factory.create('user', { username: faker.internet.userName() });
        const user2 = Factory.create('user', { username: faker.internet.userName() });
        const user3 = Factory.create('user', { username: faker.internet.userName() });
        like._execute({ userId: user1._id }, { pinId });
        like._execute({ userId: user2._id }, { pinId });
        like._execute({ userId: user3._id }, { pinId });

        chai.assert.equal(3, Pins.findOne({ _id: pinId }).likesCount);

        unlike._execute({ userId: user1._id }, { pinId });
        chai.assert.equal(2, Pins.findOne({ _id: pinId }).likesCount);

        unlike._execute({ userId: user1._id }, { pinId });
        chai.assert.equal(2, Pins.findOne({ _id: pinId }).likesCount);

        unlike._execute({ userId: user1._id }, { pinId });
        chai.assert.equal(2, Pins.findOne({ _id: pinId }).likesCount);

        insertNotificationStub.restore();
      });
    });
  });
}
