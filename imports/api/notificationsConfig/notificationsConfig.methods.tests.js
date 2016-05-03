/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Factory } from 'meteor/dburles:factory';
import '../fixtures.tests.js';
import { NotificationsConfig } from './notificationsConfig.js';

if (Meteor.isServer) {
  describe('NotificationsConfig.methods', function () {
    describe('NotificationsConfig.methods.insert', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should insert a new notification config', function () {
        const user = Factory.create('user');
        const notificationConfigId = NotificationsConfig.methods.insert._execute(
          {},
          { userId: user._id }
        );

        const notificationConfig = NotificationsConfig.findOne({ _id: notificationConfigId });
        chai.assert.isObject(notificationConfig);
        chai.assert.equal(notificationConfig.userId, user._id);
      });
    });
    describe('NotificationsConfig.methods.setData', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not set data if user is not logged in', function () {
        const user = Factory.create('user');
        NotificationsConfig.methods.insert._execute({}, { userId: user._id });

        chai.assert.throws(() => {
          NotificationsConfig.methods.setData._execute({}, {});
        }, Meteor.Error, /Must be logged in to update notifications config./);
      });
      it('should set data', function () {
        const user = Factory.create('user');
        const notificationConfigId = NotificationsConfig.methods.insert._execute(
          {},
          { userId: user._id }
        );
        const fieldsToSet = {
          pinsYourPin: false,
          likesYourPin: false,
        };

        const updated = NotificationsConfig.methods.setData._execute(
          { userId: user._id },
          fieldsToSet
        );

        chai.assert.equal(1, updated);

        const notificationConfig = NotificationsConfig.findOne({ _id: notificationConfigId });
        chai.assert.isFalse(notificationConfig.pinsYourPin);
        chai.assert.isFalse(notificationConfig.likesYourPin);
        chai.assert.isTrue(notificationConfig.userFollowsYou);
        chai.assert.isTrue(notificationConfig.followsYourBoard);
      });
    });
  });
}
