/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Boards } from '../../boards/boards.js';
import { Pins } from '../pins.js';

/*
 * FIXME: return only the public fields.
 * use simple Schema to check boardId param.
 */
Meteor.publishComposite('pins.inBoardPublic', function pinsInBoardPublic(boardId) {
  return {
    find() {
      // Find board. Even though we only want to return
      // one record here, we use "find" instead of "findOne"
      // since this function should return a cursor.
      return Boards.find({ _id: boardId, isPrivate: false }, { limit: 1 });
    },
    children: [{
      find(board) {
        return Pins.find({ boardId: board._id });
      },
    }],
  };
});

/*
 * TODO: check if the board with id boardId is owned by the logged in user,
 * return empty cursor if is not the owner, return the pins in board otherwise.
 */
Meteor.publishComposite('pins.inBoardPrivate', function pinsInBoardPrivate(boardId) {
  const userId = this.userId;
  /*
   * NOTE: in order to return an empty cursor we can not use
   * this.ready inside a publisComposite, we have to return an
   * object qith an empty find function.
   */
  if (!userId) {
    return { find() {} };
  }
  return {
    find() {
      return Boards.find({ userId, _id: boardId }, { limit: 1 });
    },
    children: [{
      find(board) {
        return Pins.find({ boardId: board._id });
      },
    }],
  };
});
