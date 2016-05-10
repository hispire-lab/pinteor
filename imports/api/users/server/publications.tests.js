/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import { Factory } from 'meteor/dburles:factory';
import '../../fixtures.tests.js';
import { PublicationCollector } from 'meteor/publication-collector';
import './publications.js';

if (Meteor.isServer) {
  describe('Users.publications', function () {
    describe('Users.publications.userData', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should send public user data when the user is not owner', function (done) {
        const user = Factory.create('user');
        Factory.create('board', { userId: user._id, name: 'board A', isPrivate: false });
        Factory.create('board', { userId: user._id, name: 'board B', isPrivate: false });
        Factory.create('board', { userId: user._id, name: 'board C', isPrivate: true });

        const collector = new PublicationCollector();

        collector.collect('users.withBoards', user.username, (collections) => {
          chai.assert.equal(2, collections.Boards.length);
          done();
        });
      });
      it('should send public and private user data when the user is owner', function (done) {
        const user = Factory.create('user');
        Factory.create('board', { userId: user._id, name: 'board A', isPrivate: false });
        Factory.create('board', { userId: user._id, name: 'board B', isPrivate: true });
        Factory.create('board', { userId: user._id, name: 'board C', isPrivate: true });

        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('users.withBoards', user.username, (collections) => {
          chai.assert.equal(3, collections.Boards.length);
          done();
        });
      });
    });
  });
}
