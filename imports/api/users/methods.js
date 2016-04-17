import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Users } from './users.js';

/*
 * TODO:
 * Attach method to a namespace, like Users.methods.follow
 */
const follow = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Users.methods.follow',
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
        'Users.methods.follow.not-logged-in',
        'Must be logged in to follow an user.'
      );
    }

    const dstUser = Users.findOne({ _id: dstUserId });
    if (!dstUser) {
      throw new Meteor.Error(
        'Users.methods.follow.not-found',
        'Cannot follow a non existing user.'
      );
    }
    /*
     * this mutator operation could be inside Users.update hook, i put it here
     * beacuse i don't know how to subclass Meteor.users collection.
     */
    Users.update(
      { _id: dstUserId },
      { $addToSet: { followers: this.userId } }
    );

    return Users.update(
      { _id: this.userId },
      { $addToSet: { following: dstUserId } }
    );
  },
});

export { follow };
