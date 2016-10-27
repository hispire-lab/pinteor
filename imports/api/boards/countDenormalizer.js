  /* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */
import R from 'ramda';
import { check, Match } from 'meteor/check';
import Users from '../users/users.js';
import Boards from './boards.js';

const countDenormalizer = {

  _updateBoardsCount(userId) {
    // we only count the public boards
    const boardCount = Boards.find({ userId, isPrivate: false }).count();

    Users.update(
      { _id: userId },
      { $set: { boardCount } }
    );
  },

  afterInsertBoard(board) {
    this._updateBoardsCount(board.userId);
  },

  afterUpdateBoard(selector, modifier) {
    check(selector, Match.OneOf(
      { _id: String }
    ));
    // Note: i can avoid an unnecessary board count update if
    // i check that the updated isPrivate is not equal to the current
    // isPrivate, in order to allow that i need to perform this check
    // in a beforeUpdateBoard hook
    if (R.has('isPrivate', modifier.$set)) {
      const board = Boards.findOne(selector, { fields: { userId: 1 } });
      this._updateBoardsCount(board.userId);
    }
  },

  afterRemoveBoards(boards) {
    boards.forEach(board => this._updateBoardsCount(board.userId));
  },

};

export default countDenormalizer;
