/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */

import R from 'ramda';
import { check, Match } from 'meteor/check';
import Boards from '../boards/boards.js';
import Pins from './pins.js';

const imageUrlDenormalizer = {

  _updateImageUrl({ boardId }) {
    const lastUpdatedPin = Pins.findOne({ boardId }, {
      sort: { updatedAt: -1, limit: 1 },
    });
    let imageUrl;
    if (lastUpdatedPin) {
      imageUrl = lastUpdatedPin.imageUrl;
    } else {
      imageUrl = 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg';
    }

    Boards.update({ _id: boardId }, { $set: { imageUrl } });
  },

  afterInsertPin(pin) {
    const { boardId } = pin;
    this._updateImageUrl({ boardId });
  },

  afterUpdatePin(selector, modifier) {
    check(selector, Match.OneOf(
      { _id: String }
    ));

    const modifierHas = R.has(R.__, modifier.$set);
    if (R.and(modifierHas('boardId'), modifierHas('oldBoardId'))) {
      this._updateImageUrl({ boardId: modifier.$set.boardId });
      this._updateImageUrl({ boardId: modifier.$set.oldBoardId });
    }
  },

};

export default imageUrlDenormalizer;
