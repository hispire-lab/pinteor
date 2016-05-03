import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Comments } from './comments.collection.js';
import { Pins } from '../pins/pins.js';
import { Users } from '../users/users.js';

Comments.methods = Comments.methods || {};

Comments.methods.insert = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Comments.methods.insert',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: new SimpleSchema({
    pinId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    text: {
      type: String,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ pinId, text }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Comments.methods.insert.not-logged-in',
        'Must be logged in to comment a pin.'
      );
    }

    const pin = Pins.findOne({ _id: pinId });
    if (!pin) {
      throw new Meteor.Error(
        'Comments.methods.insert.not-found',
        'Cannot comment on a non existing pin.'
      );
    }

    if (pin.isPrivate) {
      throw new Meteor.Error(
        'Comments.methods.insert.access-denied',
        'Cannot comment on a private pin.'
      );
    }

    const author = Users.findOne(
      { _id: this.userId },
      { fields: { username: 1 } }
    );

    const newComment = {
      authorId: this.userId,
      authorName: author.username,
      pinId,
      text,
    };

    return Comments.insert(newComment);
  },
});

export { Comments };
