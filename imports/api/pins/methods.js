import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Pins } from './pins.js';
import { Boards } from '../boards/boards.js';
import { Notifications } from '../notifications/notifications.js';

/*
 * TODO: Attach method to a namespace, like Pins.methods.insert
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
    imgUrl: {
      type: String,
    },
    description: {
      type: String,
      optional: true,
    },
    boardId: {
      type: String,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ boardId, imgUrl, description }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Pins.methods.insert.not-logged-in',
        'Must be logged in to insert a pin.'
      );
    }

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
      userId: this.userId,
      boardId,
      imgUrl,
      description,
      isPrivate: board.isPrivate,
    };
    return Pins.insert(newPin);
  },
});

/*
 * TODO: Attach method to a namespace, like Pins.methods.remove
 */
const remove = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Pins.methods.remove',
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
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ pinId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Pins.methods.remove.not-logged-in',
        'Must be logged in to remove a pin.'
      );
    }

    const pin = Pins.findOne({ _id: pinId });
    if (!pin) {
      throw new Meteor.Error(
        'Comments.methods.remove.not-found',
        'Cannot remove a non existing pin.'
      );
    }

    return Pins.remove({ _id: pinId });
  },
});

/*
 * TODO:
 * Attach method to a namespace, like Pins.methods.setPinData
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
 * Attach method to a namespace, like Pins.methods.move
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

/*
 * TODO:
 * Attach method to a namespace, like Pins.methods.copy
 */
const copy = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Pins.methods.copy',
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
        'Pins.methods.copy.not-logged-in',
        'Must be logged in to copy a pin.'
      );
    }
    // This is complex auth stuff - perhaps denormalizing a userId onto todos
    // would be correct here?
    const pin = Pins.findOne({ _id: pinId });
    if (!pin.editableBy(this.userId)) {
      throw new Meteor.Error(
        'Pins.methods.copy.access-denied',
        'Cannot copy a pin that is not yours.'
      );
    }

    const board = Boards.findOne({ _id: boardId });
    if (!board.editableBy(this.userId)) {
      throw new Meteor.Error(
        'Pins.methods.copy.access-denied',
        'Cannot copy a pin to a board that is not yours.'
      );
    }

    return insert._execute({ userId: this.userId }, {
      boardId,
      imgUrl: pin.imgUrl,
      description: pin.description,
    });
  },
});

/*
 * TODO:
 * Attach method to a namespace, like Pins.methods.save
 */
const save = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Pins.methods.save',
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
        'Pins.methods.save.not-logged-in',
        'Must be logged in to save a pin.'
      );
    }
    /*
     * TODO: check if thew pin exists, check if the pin is private.
     * check if user is owner of the pin.
     */
    const pin = Pins.findOne({ _id: pinId });
    if (pin.isOwner(this.userId)) {
      throw new Meteor.Error(
        'Pins.methods.save.forbidden',
        'Cannot save your own pin.'
      );
    }
    const board = Boards.findOne({ _id: boardId });
    if (!board.editableBy(this.userId)) {
      throw new Meteor.Error(
        'Pins.methods.copy.access-denied',
        'Cannot save a pin to a board that is not yours.'
      );
    }

    const result = insert._execute({ userId: this.userId }, {
      boardId,
      imgUrl: pin.imgUrl,
      description: pin.description,
    });

    Notifications.methods.insert.call({
      userId: pin.userId,
      senderId: this.userId,
      objectId: pin._id,
      objectType: 'pinsYourPin',
    });

    return result;
  },
});

/*
 * TODO:
 * Attach method to a namespace, like Pins.methods.like
 */
const like = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Pins.methods.like',
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
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  /*
   * FIXME: have no sense to be able to like a private pin
   */
  run({ pinId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Pins.methods.like.not-logged-in',
        'Must be logged in to like a pin.'
      );
    }
    const pin = Pins.findOne({ _id: pinId });
    if (!pin) {
      throw new Meteor.Error(
        'Pins.methods.like.not-found',
        'Cannot like a non existing pin.'
      );
    }
    if (pin.isOwner(this.userId)) {
      throw new Meteor.Error(
        'Pins.methods.like.forbidden',
        'Cannot like your own pin.'
      );
    }

    const result = Pins.update(
      { _id: pinId },
      { $addToSet: { likes: this.userId } }
    );

    Notifications.methods.insert.call({
      userId: pin.userId,
      senderId: this.userId,
      objectId: pin._id,
      objectType: 'likesYourPin',
    });

    return result;
  },
});

/*
 * TODO:
 * Attach method to a namespace, like Pins.methods.unlike
 */
const unlike = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Pins.methods.unlike',
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
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  /*
   * FIXME:
   * have no sense to be able to unlike a private pin
   */
  run({ pinId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Pins.methods.like.not-logged-in',
        'Must be logged in to unlike a pin.'
      );
    }
    const pin = Pins.findOne({ _id: pinId });
    if (!pin) {
      throw new Meteor.Error(
        'Pins.methods.like.not-found',
        'Cannot unlike a non existing pin.'
      );
    }
    if (pin.isOwner(this.userId)) {
      throw new Meteor.Error(
        'Pins.methods.unlike.forbidden',
        'Cannot unlike your own pin.'
      );
    }
    return Pins.update(
      { _id: pinId },
      { $pull: { likes: this.userId } }
    );
  },
});

export { insert, remove, setPinData, move, copy, save, like, unlike };
