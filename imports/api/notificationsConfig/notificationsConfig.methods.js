import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { NotificationsConfig } from './notificationsConfig.collection.js';

NotificationsConfig.methods = NotificationsConfig.methods || {};

/*
 * TODO: Attach method to a namespace, like NotificationsConfig.methods.insert
 */
NotificationsConfig.methods.insert = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'NotificationsConfig.methods.insert',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: new SimpleSchema({
    userId: {
      type: String,
      regEx: [SimpleSchema.RegEx.Id],
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ userId }) {
    return NotificationsConfig.insert({ userId });
  },
});

/*
 * TODO: Attach method to a namespace, like NotificationsConfig.methods.setData
 */
NotificationsConfig.methods.setData = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'NotificationsConfig.methods.setData',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: new SimpleSchema({
    pinsYourPin: {
      type: Boolean,
      optional: true,
    },
    likesYourPin: {
      type: Boolean,
      optional: true,
    },
    userFollowsYou: {
      type: Boolean,
      optional: true,
    },
    followsYourBoard: {
      type: Boolean,
      optional: true,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run(fieldsToSet) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      throw new Meteor.Error(
        'NotificationsConfig.methods.setData.not-logged-in',
        'Must be logged in to update notifications config.'
      );
    }
    /*
     * NOTE: should i remove notifications if i set i to false or
     * just not show them?
     */
    return NotificationsConfig.update(
      { userId: this.userId },
      { $set: fieldsToSet }
    );
  },
});

export { NotificationsConfig };
