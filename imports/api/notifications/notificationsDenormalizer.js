/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */

import { R } from 'meteor/ramda:ramda';
import { check, Match } from 'meteor/check';
import { insert } from './methods.js';
import { Pins } from '../pins/pins.js';

const notificationsDenormalizer = {

  _createNotification(userId, senderId, objectId, objectType) {
    insert.call({ userId, senderId, objectId, objectType });
  },

  afterUpdatePin(selector, modifier) {
    // we have three types of modifiers, $set, $addToSet and $pull
    /*
     * TODO: be more restrictive with likes checks, instead of checking for String,
     * figure out how to check for userIds.
     */
    check(modifier, Match.OneOf(
      { $set: Object },
      { $addToSet: { likes: String } },
      { $pull: { likes: String } }
    ));
    if (R.has('$addToSet', modifier)) {
      const pinId = selector._id;
      const userId = Pins.findOne({ _id: pinId }, { fields: { userId: 1 } }).userId;
      const senderId = modifier.$addToSet.likes;
      this._createNotification(userId, senderId, pinId, 'Pin');
    }
  },
};

export default notificationsDenormalizer;
