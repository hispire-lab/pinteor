/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */

// import { R } from 'meteor/ramda:ramda';
// import { check, Match } from 'meteor/check';
import { Comments } from './comments.js';
import { Pins } from './pins.js';
// import { Users } from '../users/users.js';

const commentsCountDenormalizer = {

  _updatePinCommentsCount(pinId) {
    const commentsCount = Comments.find({ pinId }).count();
    Pins.update(
      { _id: pinId },
      { $set: { commentsCount } }
    );
  },

  afterInsertComment(comment) {
    this._updatePinCommentsCount(comment.pinId);
  },

};

export default commentsCountDenormalizer;
