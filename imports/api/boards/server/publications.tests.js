/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { chai } from 'meteor/practicalmeteor:chai';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import '../../fixtures.tests.js';
import { PublicationCollector } from 'meteor/publication-collector';
import './publications.js';

if (Meteor.isServer) {
  describe('Boards.publications', function () {
    describe('Boards.publications.boardsPublic', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should send public boards when user is logged in', function (done) {
        const user = Factory.create('user');
        Factory.create('board', { userId: user._id, name: 'board A', isPrivate: false });
        Factory.create('board', { userId: user._id, name: 'board B', isPrivate: true });
        Factory.create('board', { userId: user._id, name: 'board C', isPrivate: true });
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('boards.public', user._id, (collections) => {
          chai.assert.equal(1, collections.Boards.length);
          done();
        });
      });
      it('should send public boards', function (done) {
        const user = Factory.create('user');
        Factory.create('board', { userId: user._id, name: 'board A', isPrivate: false });
        Factory.create('board', { userId: user._id, name: 'board B', isPrivate: false });
        Factory.create('board', { userId: user._id, name: 'board C', isPrivate: true });
        const collector = new PublicationCollector();

        collector.collect('boards.public', user._id, (collections) => {
          chai.assert.equal(2, collections.Boards.length);
          done();
        });
      });
    });
    describe('Boards.publications.boardsPrivate', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not send private boards when user is not logged in', function (done) {
        const user = Factory.create('user');
        Factory.create('board', { userId: user._id, name: 'board A', isPrivate: true });
        Factory.create('board', { userId: user._id, name: 'board B', isPrivate: true });
        Factory.create('board', { userId: user._id, name: 'board C', isPrivate: false });

        const collector = new PublicationCollector();

        collector.collect('boards.private', (collections) => {
          chai.assert.isUndefined(collections.Boards);
          done();
        });
      });
      it('should not send private boards when logged in as another user', function (done) {
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        Factory.create('board', { userId: user._id, name: 'board A', isPrivate: true });
        Factory.create('board', { userId: user._id, name: 'board B', isPrivate: true });
        Factory.create('board', { userId: user._id, name: 'board C', isPrivate: false });

        const collector = new PublicationCollector({ userId: userAnother._id });

        collector.collect('boards.private', (collections) => {
          chai.assert.isUndefined(collections.Boards);
          done();
        });
      });
      it('should send all private boards when logged in as owner', function (done) {
        const user = Factory.create('user');
        Factory.create('board', { userId: user._id, name: 'board A', isPrivate: true });
        Factory.create('board', { userId: user._id, name: 'board B', isPrivate: true });
        Factory.create('board', { userId: user._id, name: 'board C', isPrivate: false });
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('boards.private', (collections) => {
          chai.assert.equal(2, collections.Boards.length);
          done();
        });
      });
    });
  });
}
