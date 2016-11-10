/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { DDP } from 'meteor/ddp-client';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { assert } from 'meteor/practicalmeteor:chai';
import { Promise } from 'meteor/promise';
import { $ } from 'meteor/jquery';
import { denodeify } from '../../utils/denodeify';
import { generateData } from './../../api/generate-data.app-tests.js';
import Users from '../../api/users/users.js';

// Utility -- returns a promise which resolves when all subscriptions are done
const waitForSubscriptions = () => new Promise((resolve) => {
  const poll = Meteor.setInterval(() => {
    if (DDP._allSubscriptionsReady()) {
      Meteor.clearInterval(poll);
      resolve();
    }
  }, 200);
});

// Tracker.afterFlush runs code when all consequent of a tracker based change
//   (such as a route change) have occured. This makes it a promise.
const afterFlushPromise = denodeify(Tracker.afterFlush);

if (Meteor.isClient) {
  describe('data available when routed', () => {
    // First, ensure the data that we expect is loaded on the server
    // Then, route the app to the home page
    beforeEach(() => generateData()
      .then(() => FlowRouter.go('App.home_page'))
      .then(waitForSubscriptions)
    );
    describe('when not logged in', function () {
      it('renders login buttons', function () {
        assert.equal($('#login-buttons').length, true);
      });
    });
    describe('when logged in', () => {
      beforeEach(function (done) {
        Meteor.loginWithPassword('pitxon', 'password', done);
      });
      afterEach(function (done) {
        Meteor.logout(done);
      });
      it('has public boards at user page', function () {
        const user = Users.findOne();
        FlowRouter.go('App.user_page', { username: user.username });
        return afterFlushPromise()
          .then(waitForSubscriptions)
          .then(() => {
            // Note: using the assertion below i get the following error,
            // expected '\n        pitxon\n      ' to equal 'pitxon'
            // seems like boostrap page-header class surrounds the
            // text with additional spaces.
            // assert.equal($('.page-header').first().text(), user.username);
            assert.equal($(`.page-header:contains('${user.username}')`).length, true);
          });
      });
    });
  });
}
