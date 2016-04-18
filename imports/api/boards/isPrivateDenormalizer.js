/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */

import { R } from 'meteor/ramda:ramda';
import { check, Match } from 'meteor/check';
import { Pins } from '../pins/pins.js';
import { Boards } from './boards.js';

const isPrivateDenormalizer = {

  _updatePin(pinId, isPrivate) {
    Pins.update({ _id: pinId }, { $set: { isPrivate } });
  },

  afterUpdateBoard(selector, modifier) {
    // We only support very limited operations on boards
    check(modifier, { $set: Object });
    // We can only deal with $set modifiers, but that's all we do in this app
    if (R.has('isPrivate', modifier.$set)) {
      const pins = Pins.find({ boardId: selector._id }, { fields: { _id: 1 } });
      // check if the board has at least one pin, empty boards can exists.
      if (pins) {
        pins.forEach(pin => {
          this._updatePin(pin._id, modifier.$set.isPrivate);
        });
      }
    }
  },

  afterUpdatePin(selector, modifier) {
    // we have two types of modifiers, $set and $addToSet
    Match.test(modifier, Match.OneOf({ $set: Object }, { $addToSet: String }));
    // the modifier is $set
    if (modifier.$set) {
      if (R.has('boardId', modifier.$set)) {
        const board = Boards.findOne({ _id: modifier.$set.boardId });
        const pin = Pins.findOne({ _id: selector._id }, { fields: { _id: 1 } });
        this._updatePin(pin._id, board.isPrivate);
      }
    }
  },

};

export default isPrivateDenormalizer;
