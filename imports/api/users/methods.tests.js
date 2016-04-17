/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { chai } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import faker from 'faker';
import { Users } from './users.js';
import { follow, unfollow } from './methods.js';

Factory.define('user', Users, {
  username: faker.name.firstName(),
  createdAt: new Date(),
});

if (Meteor.isServer) {
  describe('Users.methods', function () {
    describe('Users.methods.follow', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not follow an user if user not exists', function () {
        const srcUser = Factory.create('user');

        chai.assert.throws(() => {
          follow._execute({ userId: srcUser._id }, { dstUserId: Random.id() });
        }, Meteor.Error, /Cannot follow a non existing user./);
      });
      it('should follow another user', function () {
        const srcUser = Factory.create('user', { username: 'username1' });
        const dstUser = Factory.create('user', { username: 'username2' });

        follow._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        chai.assert.equal(
          Users.findOne({ _id: srcUser._id, following: dstUser._id })._id,
          srcUser._id
        );
      });
      it('should follow another user and be a follower', function () {
        const srcUser = Factory.create('user', { username: 'username1' });
        const dstUser = Factory.create('user', { username: 'username2' });

        follow._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        chai.assert.equal(
          Users.findOne({ _id: dstUser._id, followers: srcUser._id })._id,
          dstUser._id
        );
      });
    });
    describe('Users.methods.unfollow', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not unfollow an user if user not exists', function () {
        const srcUser = Factory.create('user');

        chai.assert.throws(() => {
          unfollow._execute({ userId: srcUser._id }, { dstUserId: Random.id() });
        }, Meteor.Error, /Cannot unfollow a non existing user./);
      });
      it('should unfollow another user', function () {
        const srcUser = Factory.create('user', { username: 'username1' });
        const dstUser = Factory.create('user', { username: 'username2' });
        follow._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        unfollow._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        chai.assert.isUndefined(
          Users.findOne({ id: srcUser._id, following: dstUser._id })
        );
      });
      it('should unfollow another user an not be a follower.', function () {
        const srcUser = Factory.create('user', { username: 'username1' });
        const dstUser = Factory.create('user', { username: 'username2' });
        follow._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        unfollow._execute({ userId: srcUser._id }, { dstUserId: dstUser._id });

        chai.assert.isUndefined(
          Users.findOne({ _id: dstUser._id, followers: srcUser._id })
        );
      });
    });
  });
}
