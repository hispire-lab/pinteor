/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { Pins } from '../pins/pins.js';
import { Boards } from './boards.js';
import { insert, setPrivate, remove } from './methods.js';

if (Meteor.isServer) {
  describe('Boards.methods', function () {
    describe('Boards.methods.insert', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should get board id on successfull insert', function () {
        const user = Factory.create('user');
        const boardId = insert._execute({ userId: user._id }, {
          name: 'board A',
        });
        /*
         * FIXME: instead of checking the type of boardId against the string type,
         * will be better if we check it against simpleSchema id regex.
         */
        chai.assert.typeOf(boardId, 'string');
      });
      it('should throw an error when user is not logged in', function () {
        chai.assert.throws(() => {
          insert._execute({}, { name: 'board A' });
        }, Meteor.Error, /Must be logged in to create a board./);
      });
      it('should create new date when create a new board', function () {
        const user = Factory.create('user');
        const boardId = insert._execute({ userId: user._id }, {
          name: 'board A',
        });

        chai.assert.typeOf(Boards.findOne({ _id: boardId }).createdAt, 'date');
      });
      it('should not create a new board if name is not a string', function () {
        const user = Factory.create('user');

        chai.assert.throws(() => {
          insert._execute({ userId: user._id }, { name: {} });
        }, Meteor.Error, /Name must be a string/);
      });
      it('should not create a new board if slug is not unique', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, name: 'board A' });

        chai.assert.throws(() => {
          insert._execute({ userId: board.userId }, { name: 'board a' });
        }, Meteor.Error, /name must be unique./);
      });
    });
    describe('Boards.methods.setPrivate', function () {
      /*
       * TODO: a call to setPrivate will make a query to change the privacy of a board if
       * the new privacy is different than the current one, will nice if we can test
       * when the query actually happens or not, use a spy to test that thing.
       */
      beforeEach(function () {
        resetDatabase();
      });
      it('should not make private a board when the user is not logged', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        chai.assert.throws(() => {
          setPrivate._execute({}, { isPrivate: true, boardId: board._id });
        }, Meteor.Error, /Must be logged in to make private a board./);
      });
      it('should not make private a board when the user is not owner', function () {
        const userNotOwner = Factory.create('user', { username: faker.internet.userName() });
        const userOwner = Factory.create('user');
        const board = Factory.create('board', { userId: userOwner._id, name: 'board A' });

        chai.assert.throws(() => {
          setPrivate._execute(
            { userId: userNotOwner._id },
            { isPrivate: true, boardId: board._id }
          );
        }, Meteor.Error, /Cannot make private a board that is not yours./);
      });
      it('should make private a public board when the user is logged and is owner', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        setPrivate._execute({ userId: board.userId }, { isPrivate: true, boardId: board._id });
        chai.assert.equal(true, Boards.findOne({ _id: board._id }).isPrivate);
      });
      it('should make private a private board when the user is logged and is owner', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, isPrivate: true });

        setPrivate._execute({ userId: board.userId }, { isPrivate: true, boardId: board._id });

        chai.assert.equal(true, Boards.findOne({ _id: board._id }).isPrivate);
      });
      it('should make private all pins when make private a public board', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        setPrivate._execute({ userId: board.userId }, { isPrivate: true, boardId: board._id });

        const pins = Pins.find({ boardId: board._id });
        pins.forEach(pin => {
          chai.assert.equal(true, pin.isPrivate);
        });
      });
      it('should make public all pins when make public a private board', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, isPrivate: true });

        setPrivate._execute({ userId: board.userId }, { isPrivate: false, boardId: board._id });

        const pins = Pins.find({ boardId: board._id });
        pins.forEach(pin => {
          chai.assert.equal(false, pin.isPrivate);
        });
      });
    });
    describe('Boards.methods.remove', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not be able to remove a board when the user is not logged in', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        chai.assert.throws(() => {
          remove._execute({}, { boardId: board._id });
        }, Meteor.Error, /Must be logged in to remove a board./);
      });
      it('should not be able to remove a board when the user is not owner', function () {
        const userNotOwner = Factory.create('user', { username: faker.internet.userName() });
        const userOwner = Factory.create('user');
        const board = Factory.create('board', { userId: userOwner._id });

        chai.assert.throws(() => {
          remove._execute({ userId: userNotOwner._id }, { boardId: board._id });
        }, Meteor.Error, /Cannot remove a board that is not yours./);
      });
      it('should be able to remove a board when the user is owner', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        remove._execute({ userId: board.userId }, { boardId: board._id });

        chai.assert.isUndefined(Boards.findOne({ _id: board._id }));
      });
      it('should remove pins inside board when remove a board', function () {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });

        remove._execute({ userId: board.userId }, { boardId: board._id });

        chai.assert.equal(0, Pins.find({ boardId: board._id }).count());
      });
    });
  });
}
