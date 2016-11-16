/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */
import R from 'ramda';
import { check, Match } from 'meteor/check';
import Users from '../users/users.js';
import Boards from '../boards/boards.js';
import Pins from './pins.js';

const pinCountDenormalizer = {

  _updatePinCount(pin) {
    // we only count the public pins for users
    const userPinCount = Pins.find({
      userId: pin.userId,
      isPrivate: false,
    }).count();

    Users.update(
      { _id: pin.userId },
      { $set: { pinCount: userPinCount } }
    );

    const boardPinCount = Pins.find({
      userId: pin.userId,
      boardId: pin.boardId,
    }).count();

    Boards.update(
      { _id: pin.boardId },
      { $set: { pinCount: boardPinCount } },
    );
  },

  _updateUserPinCount({ userId }) {
    // we only count the public pins for users
    const userPinCount = Pins.find({ userId, isPrivate: false }).count();
    Users.update(
      { _id: userId },
      { $set: { pinCount: userPinCount } }
    );
  },

  _updateBoardPinCount({ userId, boardId }) {
    const boardPinCount = Pins.find({ userId, boardId }).count();
    Boards.update(
      { _id: boardId },
      { $set: { pinCount: boardPinCount } },
    );
  },

  afterInsertPin(pin) {
    this._updatePinCount(pin);
  },

  afterUpdatePin(selector, modifier) {
    check(selector, Match.OneOf(
      { _id: String }
    ));

    if (R.has('oldBoardId', modifier.$set)) {
      const pin = Pins.findOne(selector, { fields: { userId: 1 } });
      const { userId } = pin;
      // this._updateUserPinCount({ userId });

      this._updateBoardPinCount({ userId, boardId: modifier.$set.oldBoardId });
      this._updateBoardPinCount({ userId, boardId: modifier.$set.boardId });
    }

    if (R.has('isPrivate', modifier.$set)) {
      const pin = Pins.findOne(selector, { fields: { userId: 1 } });
      const { userId } = pin;
      this._updateUserPinCount({ userId });
    }
  },

};

export default pinCountDenormalizer;
