import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Pins } from './pins.js';
import { Boards } from '../boards/boards.js';

/*
 * TODO:
 * Attach method to a namespace, like Pins.methods.insert
 */
const insert = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Pins.methods.insert',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: new SimpleSchema({
    title: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    boardId: {
      type: String,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ boardId, title, imgUrl }) {
    const board = Boards.findOne({ _id: boardId });
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!board.editableBy(this.userId)) {
      throw new Meteor.Error(
        'Boards.methods.insert.access-denied',
        'Cannot add a pin to a board that is not yours.'
      );
    }
    const newPin = {
      boardId,
      title,
      imgUrl,
      isPrivate: board.isPrivate,
    };
    return Pins.insert(newPin);
  },
});

/*
 * TODO:
 * Attach method to a namespace, like Pins.methods.insert
 */
const setPinData = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Pins.methods.setPinData',
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
    // nested schema rules should be sourrounded by commas
    'fieldsToSet.title': {
      type: String,
    },
    // nested schema rules should be sourrounded by commas
    'fieldsToSet.imgUrl': {
      type: String,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ pinId, fieldsToSet }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Pins.methods.setPinData.not-logged-in',
        'Must be logged in to edit pin data.'
      );
    }
    // This is complex auth stuff - perhaps denormalizing a userId onto todos
    // would be correct here?
    const pin = Pins.findOne({ _id: pinId });
    if (!pin.editableBy(this.userId)) {
      throw new Meteor.Error(
        'Pins.methods.setPinData.access-denied',
        'Cannot edit a pin that is not yours.'
      );
    }

    Pins.update({ _id: pinId }, { $set: fieldsToSet });
  },
});

/*
 * TODO:
 * Attach method to a namespace, like Pins.methods.insert
 */
const move = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Pins.methods.move',
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
    boardId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ pinId, boardId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Pins.methods.move.not-logged-in',
        'Must be logged in to move a pin.'
      );
    }
    // This is complex auth stuff - perhaps denormalizing a userId onto todos
    // would be correct here?
    const pin = Pins.findOne({ _id: pinId });
    if (!pin.editableBy(this.userId)) {
      throw new Meteor.Error(
        'Pins.methods.move.access-denied',
        'Cannot move a pin that is not yours.'
      );
    }

    const board = Boards.findOne({ _id: boardId });
    if (!board.editableBy(this.userId)) {
      throw new Meteor.Error(
        'Pins.methods.move.access-denied',
        'Cannot move a pin to a board that is not yours.'
      );
    }

    Pins.update({ _id: pinId }, { $set: { boardId } });
  },
});

export { insert, setPinData, move };
