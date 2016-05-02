/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { stubInsertNotification } from '../stubs.tests.js';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Users } from './users.js';
import { followUser, unfollowUser } from './methods.js';


if (Meteor.isServer) {
  describe('Users.methods', function () {
    describe('Users.methods.followUser', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not follow an user if user not exists', function () {
        const srcUser = Factory.create('user');

        chai.assert.throws(() => {
          followUser._execute({ userId: srcUser._id }, { dstUserId: Random.id() });
        }, Meteor.Error, /Cannot follow a non existing user./);
      });
      it('should follow another user', function () {
        const insertNotificationStub = stubInsertNotification();
        const srcUser = Factory.create('user', { username: faker.internet.userName() });
        const dstUser = Factory.create('user', { username: faker.internet.userName() });

        followUser._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        chai.assert.equal(
          Users.findOne({ _id: srcUser._id, usersFollowing: dstUser._id })._id,
          srcUser._id
        );
        insertNotificationStub.restore();
      });
      it('should follow another user and be a follower', function () {
        const insertNotificationStub = stubInsertNotification();
        const srcUser = Factory.create('user', { username: faker.internet.userName() });
        const dstUser = Factory.create('user', { username: faker.internet.userName() });

        followUser._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        chai.assert.equal(
          Users.findOne({ _id: dstUser._id, usersFollowers: srcUser._id })._id,
          dstUser._id
        );

        insertNotificationStub.restore();
      });
    });
    describe('Users.methods.unfollowUser', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not unfollow an user if user not exists', function () {
        const srcUser = Factory.create('user');

        chai.assert.throws(() => {
          unfollowUser._execute({ userId: srcUser._id }, { dstUserId: Random.id() });
        }, Meteor.Error, /Cannot unfollow a non existing user./);
      });
      it('should unfollow another user', function () {
        const insertNotificationStub = stubInsertNotification();
        const srcUser = Factory.create('user', { username: faker.internet.userName() });
        const dstUser = Factory.create('user', { username: faker.internet.userName() });
        followUser._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        unfollowUser._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        chai.assert.isUndefined(
          Users.findOne({ id: srcUser._id, usersFollowing: dstUser._id })
        );

        insertNotificationStub.restore();
      });
      it('should unfollow another user an not be a follower.', function () {
        const insertNotificationStub = stubInsertNotification();
        const srcUser = Factory.create('user', { username: faker.internet.userName() });
        const dstUser = Factory.create('user', { username: faker.internet.userName() });
        followUser._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        unfollowUser._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        chai.assert.isUndefined(
          Users.findOne({ _id: dstUser._id, usersFollowers: srcUser._id })
        );

        insertNotificationStub.restore();
      });
    });
  });
}
