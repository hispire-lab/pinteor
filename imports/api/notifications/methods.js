// import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Notifications } from './notifications.js';

/*
 * TODO:
 * Attach method to a namespace, like Notifications.methods.insert
 */
const insert = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Notifications.methods.insert',
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
      type: [SimpleSchema.RegEx.Id],
    },
    subject: {
      type: String,
    },
    body: {
      type: String,
    },
    objectId: {
      type: [SimpleSchema.RegEx.Id],
    },
    objectType: {
      type: String,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ userId, subject, body, objectId, objectType }) {
    return Notifications.insert({
      userId,
      subject,
      body,
      objectId,
      objectType,
    });
  },
});

export { insert };
