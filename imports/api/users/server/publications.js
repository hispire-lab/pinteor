/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Users } from '../users.js';
import { Boards } from '../../boards/boards.js';

/*
 * FIXME: return only the public fields.
 * use simple Schema to check username param.
 * TODO: when an user with username param does not exists
 * return empty cursor.
 */
Meteor.publishComposite('users.withBoards', function userWithBoards(username) {
  return {
    find() {
      return Users.find({ username }, { limit: 1 });
    },
    children: [{
      find(user) {
        // user public and private boards
        if (this.userId === user._id) {
          return Boards.find({ userId: user._id });
        }
        // user public boards
        return Boards.find({ userId: user._id, isPrivate: false });
      },
    }],
  };
});
