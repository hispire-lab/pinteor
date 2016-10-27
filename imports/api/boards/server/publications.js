import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Boards from '../boards.js';
import Users from '../../users/users.js';

Meteor.publish('boards.list', function boardsListPublication(username) {
  new SimpleSchema({
    username: { type: String },
  }).validate({ username });

  const user = Users.findOne({ username });
  if (!user) {
    return this.ready();
  }

  const isCurrentUser = user._id === this.userId;
  if (isCurrentUser) {
    return Boards.find(
      { userId: user._id },
      { fields: Boards.publicFields }
    );
  }

  return Boards.find(
    { userId: user._id, isPrivate: false },
    { fields: Boards.publicFields }
  );
});

Meteor.publish('boards.single', function boardSinglePublication(username, boardSlug) {
  new SimpleSchema({
    username: { type: String },
    boardSlug: { type: String },
  }).validate({ username, boardSlug });

  const user = Users.findOne({ username });
  if (!user) {
    return this.ready();
  }

  const board = Boards.find(
    { userId: user._id, slug: boardSlug },
    { fields: Boards.publicFields },
  );
  if (!board) {
    return this.ready();
  }

  const isCurrentUser = user._id === this.userId;
  if (board.isPrivate && isCurrentUser) {
    return board;
  }

  return board;
});
