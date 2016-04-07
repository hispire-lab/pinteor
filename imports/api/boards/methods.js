import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Boards } from './boards.js';

// Attach your method to a namespace
const insert = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Boards.methods.insert',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: null,
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run(newBoard) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    /*
    if (!this.userId) {
      throw new Meteor.Error('Boards.methods.insert.not-logged-in',
       'Must be logged in to create a board.');
    }
    */
    return Boards.insert(newBoard);
  },
});

export { insert };
