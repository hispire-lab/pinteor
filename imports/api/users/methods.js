import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Users } from './users.js';
import { Accounts } from 'meteor/accounts-base';
import { Boards } from '../boards/boards.js';
import { NotificationsConfig } from '../notificationsConfig/notificationsConfig.js';
import { Notifications } from '../notifications/notifications.js';
import { R } from 'meteor/ramda:ramda';

/* eslint-disable func-names, prefer-arrow-callback */
Accounts.onCreateUser(function (options, doc) {
  const user = doc;
  NotificationsConfig.methods.insert.call({ userId: user._id });
  return user;
});

/*
 * TODO: Attach method to a namespace, like Users.methods.followUser
 */
const followUser = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Users.methods.followUser',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: new SimpleSchema({
    dstUserId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ dstUserId }) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      throw new Meteor.Error(
        'Users.methods.followUser.not-logged-in',
        'Must be logged in to follow an user.'
      );
    }

    const dstUser = Users.findOne({ _id: dstUserId });
    if (!dstUser) {
      throw new Meteor.Error(
        'Users.methods.followUser.not-found',
        'Cannot follow a non existing user.'
      );
    }
    /*
     * NOTE: this mutator operation could be inside Users.update hook, i put it here
     * beacuse i don't know how to subclass Meteor.users collection.
     */
    const updatedUsersFollowers = Users.update(
      { _id: dstUserId },
      { $addToSet: { usersFollowers: this.userId } }
    );

    const updatedUsersFollowing = Users.update(
      { _id: this.userId },
      { $addToSet: { usersFollowing: dstUserId } }
    );

    Notifications.methods.insert.call({
      userId: dstUser._id,
      senderId: this.userId,
      objectId: dstUser._id,
      objectType: 'userFollowsYou',
    });

    return R.and(!!updatedUsersFollowers, !!updatedUsersFollowing);
  },
});

/*
 * TODO: Attach method to a namespace, like Users.methods.unfollowUser
 */
const unfollowUser = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Users.methods.unfollowUser',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: new SimpleSchema({
    dstUserId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ dstUserId }) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      throw new Meteor.Error(
        'Users.methods.unFollowUser.not-logged-in',
        'Must be logged in to follow an user.'
      );
    }

    const dstUser = Users.findOne({ _id: dstUserId });
    if (!dstUser) {
      throw new Meteor.Error(
        'Users.methods.unFollowUser.not-found',
        'Cannot unfollow a non existing user.'
      );
    }
    /*
     * this mutator operation could be inside Users.update hook, i put it here
     * beacuse i don't know how to subclass Meteor.users collection.
     */
    Users.update(
      { _id: dstUserId },
      { $pull: { usersFollowers: this.userId } }
    );

    return Users.update(
      { _id: this.userId },
      { $pull: { usersFollowing: dstUserId } }
    );
  },
});

/*
 * TODO: Attach method to a namespace, like Users.methods.followBoard
 */
const followBoard = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Users.methods.followBoard',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: new SimpleSchema({
    dstBoardId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ dstBoardId }) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      throw new Meteor.Error(
        'Users.methods.followBoard.not-logged-in',
        'Must be logged in to follow a board.'
      );
    }
    /*
     * FIXME: add check for cannot follow a private board.
     */
    const dstBoard = Boards.findOne({ _id: dstBoardId });
    if (!dstBoard) {
      throw new Meteor.Error(
        'Users.methods.followBoard.not-found',
        'Cannot follow a non existing board.'
      );
    }
    /*
     * this mutator operation could be inside Users.update hook, i put it here
     * because i don't know how to subclass Meteor.users collection.
     */
     /*
    const updatedBoardFollowers = Users.update(
      { _id: dstBoard.userId },
      { $addToSet: { boardsFollowers: this.userId } }
    );
    */

    const updatedBoardFollowing = Users.update(
      { _id: this.userId },
      { $addToSet: { boardsFollowing: dstBoard._id } }
    );

    Notifications.methods.insert.call({
      userId: dstBoard.userId,
      senderId: this.userId,
      objectId: dstBoard._id,
      objectType: 'followsYourBoard',
    });

    return !!updatedBoardFollowing;
  },
});


export { followUser, unfollowUser, followBoard };
