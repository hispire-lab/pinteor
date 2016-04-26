/* eslint new-cap: ["error", {"capIsNewExceptions": ["Match.OneOf"]}] */

import { R } from 'meteor/ramda:ramda';
import { check, Match } from 'meteor/check';
import { Pins } from './pins.js';
import { Users } from '../users/users.js';

const likesCountDenormalizer = {
  /*
   * FIXME: would be nice to check if the user that liked a pin was already
   * in the likers list, that means that the likesCount should not be increased
   * ( a given user can like a pin only once), with that we can avoid a uneccessary
   * likesCount update query. ( maybe this feature just makes sense if it goes
   * inside a beforeUpdatePin hook)
   */
  _updateLikesCount(pinId) {
    const pin = Pins.findOne({ _id: pinId }, { fields: { likes: 1, boardId: 1 } });

    // update pin likes count
    Pins.update(
      { _id: pinId },
      { $set: { likesCount: pin.likes.length } }
    );
    // update pin owner user likes count
    const userId = pin.board().userId;
    const owner = Users.findOne({ _id: userId });
    /*
     * FIXME: owner is undefined for all test that not create an user with Accounts.createUser()
     * seems like creating an user with Factory.define not adds a new user to Users
     * collection.
     */
    Users.update(
      { _id: userId },
      { $set: { likesCount: owner.pinsLiked().length } }
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
      this._updateLikesCount(selector._id);
    }
    // the modifier is $pull
    if (R.has('$pull', modifier)) {
      this._updateLikesCount(selector._id);
    }
  },

};

export default likesCountDenormalizer;
