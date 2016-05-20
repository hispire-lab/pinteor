/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */

import { R } from 'meteor/ramda:ramda';
import { check, Match } from 'meteor/check';
import { Users } from '../users/users.js';
import { Boards } from './boards.js';

const boardsCountDenormalizer = {

  _updateBoardsCount(userId) {
    const boardsCount = Boards.find({ userId }).count();

    Users.update(
      { _id: userId },
      { $set: { boardsCount } }
    );
  },

  afterInsertBoard(board) {
    this._updateBoardsCount(board.userId);
  },

  afterRemoveBoard(selector, board) {
    check(selector, Match.OneOf(
      { _id: String }
    ));
    if (R.has('_id', selector)) {
      this._updateBoardsCount(board.userId);
    }
  },

};

export default boardsCountDenormalizer;
