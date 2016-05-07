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
  describe('Pins.publications', function () {
    describe('Pins.publications.inBoardPublic', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should send all pins for a public board when the user is logged in', function (done) {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, isPrivate: false });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin A' });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin B' });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin C' });
        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('pins.inBoardPublic', board._id, (collections) => {
          chai.assert.equal(3, collections.Pins.length);
          done();
        });
      });
      it('should send all pins for a public board', function (done) {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, isPrivate: false });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin A' });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin B' });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin C' });
        const collector = new PublicationCollector();

        collector.collect('pins.inBoardPublic', board._id, (collections) => {
          chai.assert.equal(3, collections.Pins.length);
          done();
        });
      });
    });
    describe('Pins.publications.inBoardPrivate', function () {
      beforeEach(function () {
        resetDatabase();
      });
      it('should not send pins when user is not logged in', function (done) {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, isPrivate: true });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin A' });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin B' });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin C' });
        const collector = new PublicationCollector();

        collector.collect('pins.inBoardPrivate', board._id, (collections) => {
          chai.assert.isUndefined(collections.Pins);
          done();
        });
      });
      it('should not send pins when logged in as another user', function (done) {
        const userAnother = Factory.create('user', { username: faker.internet.userName() });
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, isPrivate: true });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin A' });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin B' });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin C' });
        const collector = new PublicationCollector({ userId: userAnother._id });

        collector.collect('pins.inBoardPrivate', board._id, (collections) => {
          chai.assert.isUndefined(collections.Pins);
          done();
        });
      });
      it('should send pins for a private board when logged in as owner', function (done) {
        const user = Factory.create('user');
        const board = Factory.create('board', { userId: user._id, isPrivate: true });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin A' });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin B' });
        Factory.create('pin', { userId: user._id, boardId: board._id, title: 'pin C' });

        const collector = new PublicationCollector({ userId: user._id });

        collector.collect('pins.inBoardPrivate', board._id, (collections) => {
          chai.assert.equal(3, collections.Pins.length);
          done();
        });
      });
    });
  });
}
