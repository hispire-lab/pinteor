/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Pins } from './pins.js';
import { insert } from './methods.js';
import { Boards } from '../boards/boards.js';

/*
 * FIXME:
 * is not a good idea to define the factories here, in the sample todo app
 * the factories are defined in the collection file, like in boards.js, seems
 * like this is either a good choice because that code will be deployed on
 * production, could be a nice idea to move the definition of factories to is
 * own file in order to be loaded just for testing purposes.
 */
Factory.define('board', Boards, {
  _id: Random.id(),
  name: 'board A',
  userId: Random.id(),
});

Factory.define('pin', Pins, {
  title: 'pin A',
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
          title: 'pin A',
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
            title: 'pin A',
            imgUrl: faker.image.imageUrl(),
          });
        }, Meteor.Error, /Cannot add a pin to a board that is not yours./);
      });
      it('should create new date if no date exists', function () {
        const pin = Factory.create('pin', {
          createdAt: undefined,
        });

        chai.assert.typeOf(pin.createdAt, 'date');
      });
      it('should not create new date if date exists', function () {
        const expectedDate = new Date();
        const actualDate = Factory.create('pin', {
          createdAt: expectedDate,
        }).createdAt;

        chai.assert.equal(actualDate.getTime(), expectedDate.getTime());
      });
    });
  });
}
