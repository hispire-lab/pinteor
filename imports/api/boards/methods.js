import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Boards } from './boards.js';

/*
 * TODO:
 * Attach method to a namespace, like Boards.methods.insert
 */
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
  validate: new SimpleSchema({
    name: {
      type: String,
    },
    description: {
      type: String,
      optional: true,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run(doc) {
    const newBoard = doc;
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      throw new Meteor.Error(
        'Boards.methods.insert.not-logged-in',
        'Must be logged in to create a board.'
      );
    }
    /*
     * FIXME:
     * i am setting here the userId of the new created doc, could be a better
     * idea to set the userId inside the insert method of BoardsCollection, i
     * don't know if i can access this.userId inside the collection.
     */
    newBoard.userId = this.userId;
    return Boards.insert(newBoard);
  },
});
/*
 * TODO:
 * Attach method to a namespace, like Boards.methods.makePrivate
 *
 * this method could be renamed to setPrivate, it will take a param to make
 * the board either public or private.
 */
const makePrivate = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Boards.methods.makePrivate',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: new SimpleSchema({
    boardId: {
      type: String,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ boardId }) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      throw new Meteor.Error(
        'Boards.methods.makePrivate.not-logged-in',
        'Must be logged in to make private a board.'
      );
    }
    /*
     * TODO:
     * maybe should check if not exists a board with the given id.
     */
    const board = Boards.findOne({ _id: boardId });

    if (board.userId !== this.userId) {
      throw new Meteor.Error(
        'Boards.methods.makePrivate.access-denied',
        'Cannot make private a board that is not yours.'
      );
    }

    // make board private just in case it is not.
    if (!board.isPrivate) {
      Boards.update({ _id: boardId }, { $set: { isPrivate: true } });
    }
  },
});

export { insert, makePrivate };
