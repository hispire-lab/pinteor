/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { insert } from './methods.js';

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
    });
  });
}
