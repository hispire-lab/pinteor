/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */
// import R from 'ramda';
// import { check, Match } from 'meteor/check';
import Users from '../users/users.js';
import Pins from './pins.js';

const pinCountDenormalizer = {

  _updatePinCount(userId) {
    // we only count the public pins
    const pinCount = Pins.find({ userId, isPrivate: false }).count();

    Users.update(
      { _id: userId },
      { $set: { pinCount } }
    );
  },

  afterInsertPin(pin) {
    this._updatePinCount(pin.userId);
  },

};

export default pinCountDenormalizer;
