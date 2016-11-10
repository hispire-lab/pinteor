// This file will be auto-imported in the app-test context,
// ensuring the method is always available

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
// import { _ } from 'meteor/underscore';
import { times } from 'ramda';
import { denodeify } from '../utils/denodeify';

// Remember to double check this is a test-only file before
// adding a method like this!
Meteor.methods({
  generateFixtures() {
    resetDatabase();

    // create an user
    const username = 'pitxon';
    const password = 'password';
    const userId = Accounts.createUser({ username, password });
    // create 2 public boards
    // _.times(2, () => Factory.create('board', { userId, username, isPrivate: false }));
    times(() => Factory.create('board', { userId, username, isPrivate: false }), 2);
    // create 2 private boards
    // _.times(2, () => Factory.create('board', { userId, username, isPrivate: true }));
    times(() => Factory.create('board', { userId, username, isPrivate: true }), 2);
  },
});

let generateData; // eslint-disable-line import/no-mutable-exports
if (Meteor.isClient) {
  // Create a second connection to the server to use to call
  // test data methods. We do this so there's no contention
  // with the currently tested user's connection.
  const testConnection = Meteor.connect(Meteor.absoluteUrl());

  generateData = denodeify((cb) => {
    testConnection.call('generateFixtures', cb);
  });
}

export { generateData };
