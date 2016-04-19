/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */

import { R } from 'meteor/ramda:ramda';
import { check, Match } from 'meteor/check';
import { Pins } from '../pins/pins.js';

const likesCountDenormalizer = {

  _updateLikesCount(userId, pinId) {
    const pin = Pins.findOne({ _id: pinId }, { fields: { likes: 1 } });

    Pins.update(
      { _id: pinId },
      { $set: { likesCount: pin.likes.length } }
    );
  },

  afterUpdatePin(selector, modifier) {
    // we have three types of modifiers, $set, $addToSet and $pull
    /*
     * TODO:
     * be more restrictive with likes checks, instead of checking for String,
     * figure out how to check for userIds.
     */
    check(modifier, Match.OneOf(
      { $set: Object },
      { $addToSet: { likes: String } },
      { $pull: { likes: String } }
    ));

    // the modifier is $addToSet
    if (R.has('$addToSet', modifier)) {
      this._updateLikesCount(modifier.$addToSet.likes, selector._id);
    }
    // the modifier is $pull
    if (R.has('$pull', modifier)) {
      this._updateLikesCount(modifier.$pull.likes, selector._id);
    }
  },

};

export default likesCountDenormalizer;
