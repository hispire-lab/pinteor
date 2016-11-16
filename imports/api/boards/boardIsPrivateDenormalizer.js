/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */
import R from 'ramda';
import { check, Match } from 'meteor/check';
import Pins from '../pins/pins.js';

const boardIsPrivateDenormalizer = {

  _updatePinPrivacy({ pinId, isPrivate }) {
    Pins.update({ _id: pinId }, { $set: { isPrivate } });
  },

  afterUpdateBoard(selector, modifier) {
    check(selector, Match.OneOf(
      { _id: String }
    ));
    if (R.has('isPrivate', modifier.$set)) {
      const boardId = selector._id;
      const pins = Pins.find({ boardId }, { fields: { _id: 1 } });
      pins.forEach(pin => this._updatePinPrivacy({
        pinId: pin._id,
        isPrivate: modifier.$set.isPrivate,
      }));
    }
  },

};

export default boardIsPrivateDenormalizer;
