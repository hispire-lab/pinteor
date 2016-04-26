/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import faker from 'faker';
import { Accounts } from 'meteor/accounts-base';
import { Users } from './users.js';
import { insert as boardInsert } from '../boards/methods.js';
import { insert as pinInsert, like as pinLike, unlike as pinUnlike } from '../pins/methods.js';


if (Meteor.isServer) {
  describe.skip('Users', function () {
    /*
     * TODO: add test for Users.likesCount with more than one board.
     */
    describe('Users.likesCount', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should increase likes count when different pins are liked', function () {
        const userId = Accounts.createUser({
          username: faker.internet.userName(),
          password: 'password',
        });
        const boardId = boardInsert._execute({ userId }, { name: 'board A' });
        const pinId1 = pinInsert._execute({ userId }, { boardId, imgUrl: faker.image.imageUrl() });
        const pinId2 = pinInsert._execute({ userId }, { boardId, imgUrl: faker.image.imageUrl() });
        const pinId3 = pinInsert._execute({ userId }, { boardId, imgUrl: faker.image.imageUrl() });

        chai.assert.equal(0, Users.findOne({ _id: userId }).likesCount);

        pinLike._execute({ userId }, { pinId: pinId1 });
        chai.assert.equal(1, Users.findOne({ _id: userId }).likesCount);

        pinLike._execute({ userId }, { pinId: pinId2 });
        chai.assert.equal(2, Users.findOne({ _id: userId }).likesCount);

        pinLike._execute({ userId }, { pinId: pinId3 });
        chai.assert.equal(3, Users.findOne({ _id: userId }).likesCount);
      });
      it('should increase likes count just once when same pins are liked', function () {
        const userId = Accounts.createUser({
          username: faker.internet.userName(),
          password: 'password',
        });
        const boardId = boardInsert._execute({ userId }, { name: 'board A' });
        const pinId = pinInsert._execute({ userId }, { boardId, imgUrl: faker.image.imageUrl() });

        chai.assert.equal(0, Users.findOne({ _id: userId }).likesCount);

        pinLike._execute({ userId }, { pinId });
        chai.assert.equal(1, Users.findOne({ _id: userId }).likesCount);

        pinLike._execute({ userId }, { pinId });
        chai.assert.equal(1, Users.findOne({ _id: userId }).likesCount);

        pinLike._execute({ userId }, { pinId });
        chai.assert.equal(1, Users.findOne({ _id: userId }).likesCount);
      });
      it('should decrease likes count when different pins are unliked', function () {
        const userId = Accounts.createUser({
          username: faker.internet.userName(),
          password: 'password',
        });
        const boardId = boardInsert._execute({ userId }, { name: 'board A' });
        const pinId1 = pinInsert._execute({ userId }, { boardId, imgUrl: faker.image.imageUrl() });
        const pinId2 = pinInsert._execute({ userId }, { boardId, imgUrl: faker.image.imageUrl() });
        const pinId3 = pinInsert._execute({ userId }, { boardId, imgUrl: faker.image.imageUrl() });

        pinLike._execute({ userId }, { pinId: pinId1 });
        pinLike._execute({ userId }, { pinId: pinId2 });
        pinLike._execute({ userId }, { pinId: pinId3 });

        chai.assert.equal(3, Users.findOne({ _id: userId }).likesCount);

        pinUnlike._execute({ userId }, { pinId: pinId1 });
        chai.assert.equal(2, Users.findOne({ _id: userId }).likesCount);

        pinUnlike._execute({ userId }, { pinId: pinId2 });
        chai.assert.equal(1, Users.findOne({ _id: userId }).likesCount);

        pinUnlike._execute({ userId }, { pinId: pinId3 });
        chai.assert.equal(0, Users.findOne({ _id: userId }).likesCount);
      });
      it('should decrease likes count just once when same pins are unliked', function () {
        const userId = Accounts.createUser({
          username: faker.internet.userName(),
          password: 'password',
        });
        const boardId = boardInsert._execute({ userId }, { name: 'board A' });
        const pinId = pinInsert._execute({ userId }, { boardId, imgUrl: faker.image.imageUrl() });

        pinLike._execute({ userId }, { pinId });

        chai.assert.equal(1, Users.findOne({ _id: userId }).likesCount);

        pinUnlike._execute({ userId }, { pinId });
        chai.assert.equal(0, Users.findOne({ _id: userId }).likesCount);

        pinUnlike._execute({ userId }, { pinId });
        chai.assert.equal(0, Users.findOne({ _id: userId }).likesCount);

        pinUnlike._execute({ userId }, { pinId });
        chai.assert.equal(0, Users.findOne({ _id: userId }).likesCount);
      });
    });
  });
}
