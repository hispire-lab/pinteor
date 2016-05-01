/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { stubInsertNotification } from '../stubs.tests.js';
import { Users } from './users.js';
import { Accounts } from 'meteor/accounts-base';
import { NotificationsConfig } from '../notificationsConfig/notificationsConfig.js';
import { like, unlike } from '../pins/methods.js';

if (Meteor.isServer) {
  describe('Users', function () {
    describe('Users.create', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should create a new user with a notification config', function () {
        const userId = Accounts.createUser({
          username: faker.internet.userName(),
          password: 'password',
        });
        chai.assert.isObject(NotificationsConfig.findOne({ userId }));
      });
    });
    describe('Users.likesCount', function () {
      /*
       * TODO: add test for Users.likesCount with more than one board.
       */
      beforeEach(function () {
        resetDatabase();
      });
      it('should increase likes count when different pins are liked', function () {
        const insertNotificationStub = stubInsertNotification();
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin1 = Factory.create('pin', { userId: user._id, boardId: board._id });
        const pin2 = Factory.create('pin', { userId: user._id, boardId: board._id });
        const pin3 = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: userAnother._id }, { pinId: pin1._id });
        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: userAnother._id }, { pinId: pin2._id });
        chai.assert.equal(2, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: userAnother._id }, { pinId: pin3._id });
        chai.assert.equal(3, Users.findOne({ _id: user._id }).likesCount);

        insertNotificationStub.restore();
      });
      it('should increase likes count just once when same pins are liked', function () {
        const insertNotificationStub = stubInsertNotification();
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: userAnother._id }, { pinId: pin._id });
        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: userAnother._id }, { pinId: pin._id });
        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        like._execute({ userId: userAnother._id }, { pinId: pin._id });
        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        insertNotificationStub.restore();
      });
      it('should decrease likes count when different pins are unliked', function () {
        const insertNotificationStub = stubInsertNotification();
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin1 = Factory.create('pin', { userId: user._id, boardId: board._id });
        const pin2 = Factory.create('pin', { userId: user._id, boardId: board._id });
        const pin3 = Factory.create('pin', { userId: user._id, boardId: board._id });

        like._execute({ userId: userAnother._id }, { pinId: pin1._id });
        like._execute({ userId: userAnother._id }, { pinId: pin2._id });
        like._execute({ userId: userAnother._id }, { pinId: pin3._id });

        chai.assert.equal(3, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: userAnother._id }, { pinId: pin1._id });
        chai.assert.equal(2, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: userAnother._id }, { pinId: pin2._id });
        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: userAnother._id }, { pinId: pin3._id });
        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);

        insertNotificationStub.restore();
      });
      it('should decrease likes count just once when same pins are unliked', function () {
        const insertNotificationStub = stubInsertNotification();
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id });
        const pin = Factory.create('pin', { userId: user._id, boardId: board._id });

        like._execute({ userId: userAnother._id }, { pinId: pin._id });

        chai.assert.equal(1, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: userAnother._id }, { pinId: pin._id });
        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: userAnother._id }, { pinId: pin._id });
        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);

        unlike._execute({ userId: userAnother._id }, { pinId: pin._id });
        chai.assert.equal(0, Users.findOne({ _id: user._id }).likesCount);

        insertNotificationStub.restore();
      });
    });
    describe('Users.helpers.unread', function () {
      beforeEach(function () {
        resetDatabase();
      });
      /*
       * NOTE: in order to pass this test the user should have a notificationsConfig
       * object inserted into the db. Using the factory does not creates this object
       * so i have two choices, create a notification object in the factory or create
       * the user via Accounts.createUser().
       */
      it('should has a notification in unreads notifications', function () {
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const userId = Accounts.createUser({
          username: faker.internet.userName(),
          password: 'password',
        });
        const board = Factory.create('board', { userId });
        const pin = Factory.create('pin', { userId, boardId: board._id });

        like._execute({ userId: userAnother._id }, { pinId: pin._id });

        const user = Users.findOne({ _id: userId });
        const unreadNotifications = user.unreadNotifications();
        chai.assert.equal(1, unreadNotifications.count());

        const unreadNotification = unreadNotifications.fetch()[0];
        chai.assert.equal(user._id, unreadNotification.userId);
        chai.assert.equal(userAnother._id, unreadNotification.senderId);
        chai.assert.equal(pin._id, unreadNotification.objectId);
        chai.assert.equal('likesYourPin', unreadNotification.objectType);
      });
    });
  });
}
