/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */

import { R } from 'meteor/ramda:ramda';
import { check, Match } from 'meteor/check';
import { Pins } from './pins.js';
import { Boards } from '../boards/boards.js';

const pinsCountDenormalizer = {

  _updateBoardPinsCount(boardId) {
    const pinsCount = Pins.find({ boardId }).count();

    Boards.update(
      { _id: boardId },
      { $set: { pinsCount } }
    );
  },

  afterInsertPin(pin) {
    this._updateBoardPinsCount(pin.boardId);
  },

  afterRemovePin(selector, pin) {
    /*
     * NOTE:
     * there are two ways to remove pins right now
     * the first one is thorught the remove pin method
     * it uses the selector _id
     * the second one is inside the board.remove method
     * that uses the selector boardId
     *
     * maybe is should refactor the board.remove to use
     * the same selector as the pin remove method.
     */
    check(selector, Match.OneOf(
      { _id: String },
      { boardId: String }
    ));
    if (R.has('_id', selector)) {
      this._updateBoardPinsCount(pin.boardId);
    }
  },

};

export default pinsCountDenormalizer;
