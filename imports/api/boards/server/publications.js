/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Boards } from '../boards.js';

/*
 * returns the public boards for a given user.
 */
/*
 * FIXME: return only the public fields.
 * use simple Schema to check userId param.
 */
Meteor.publish('boards.public', function boardsPublic(userId) {
  return Boards.find({ userId, isPrivate: false });
});

Meteor.publish('boards.private', function boardsPrivate() {
  if (!this.userId) {
    return this.ready();
  }
  return Boards.find({ userId: this.userId, isPrivate: true });
});
