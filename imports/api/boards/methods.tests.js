/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Boards } from './boards.js';
import { insert } from './methods.js';

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
          insert._execute({}, {
            name: 'board A',
          });
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
  });
}
