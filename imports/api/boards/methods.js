import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Boards } from './boards.js';
import { ValidationError } from 'meteor/mdg:validation-error';
import slug from 'slug';

slug.defaults.mode = 'pretty';
slug.defaults.modes.pretty = {
  // replace spaces with replacement
  replacement: '-',
  // replace unicode symbols or not
  symbols: true,
  // (optional) regex to remove characters
  remove: null,
  // result in lower case
  lower: true,
  // replace special characters
  charmap: slug.charmap,
  // replace multi-characters
  multicharmap: slug.multicharmap,
};

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
  /*
   * a board name is valid if the logged in user has no other boards with the same
   * slug, so if the user has already a board with name board A and tries to insert
   * another board with name Board-a it will be rejected cause both slugs are board-a
   *
   * i can't use simple schema here for validation, inside a custom rule of simple schema
   * this.userId is not visible, making impossible to perform the slugs-user checks.
   */
  validate({ name, description }) {
    new SimpleSchema({
      name: {
        type: String,
      },
      description: {
        type: String,
        optional: true,
      },
    })
    .validate({
      name,
      description,
    });
    // unique slug validation
    if (this.userId) {
      const boards = Boards.find({ userId: this.userId, slug: slug(name) });
      const errors = [];
      /*
       * FIXME:
       * have to be a better way to check wheter or not a query has empty results.
       */
      /*
       * TODO:
       * add a custom error to handle this case,
       * i.e SimpleSchema.messages({wrongPassword: "Wrong password"});
       */
      if (boards.count()) {
        errors.push({
          name: 'name',
          type: 'notUnique',
          details: {
            value: name,
          },
        });
      }
      if (errors.length) {
        throw new ValidationError(errors, 'name must be unique.');
      }
    }
  },
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
 * Attach method to a namespace, like Boards.methods.setPrivate
 *
 * rename this method to setPrivacy or updatePrivacy
 */
const setPrivate = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Boards.methods.setPrivate',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: new SimpleSchema({
    isPrivate: {
      type: Boolean,
    },
    boardId: {
      type: String,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ isPrivate, boardId }) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      throw new Meteor.Error(
        'Boards.methods.setPrivate.not-logged-in',
        'Must be logged in to make private a board.'
      );
    }
    /*
     * TODO:
     * maybe should check if not exists a board with the given id.
     */
    const board = Boards.findOne({ _id: boardId });
    if (!board.editableBy(this.userId)) {
      throw new Meteor.Error(
        'Boards.methods.setPrivate.access-denied',
        'Cannot make private a board that is not yours.'
      );
    }

    // only update board.isPrivate if it is different than isPrivate param,
    // this let us avoid an uneccesary query.
    if (board.isPrivate !== isPrivate) {
      Boards.update({ _id: boardId }, { $set: { isPrivate } });
    }
  },
});

/*
 * TODO:
 * Attach method to a namespace, like Boards.methods.setName
 *
 * rename this method to setName or updateName
 */
const setName = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Boards.methods.setName',
  // Validation function for the arguments. Only keyword arguments are accepted,
  // so the arguments are an object rather than an array. The SimpleSchema validator
  // throws a ValidationError from the mdg:validation-error package if the args don't
  // match the schema
  //
  // This Method encodes the form validation requirements.
  // By defining them in the Method, we do client and server-side
  // validation in one place.
  validate: new SimpleSchema({
    newName: {
      type: String,
    },
    boardId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  // This is the body of the method. Use ES2015 object destructuring to get
  // the keyword arguments
  run({ newName, boardId }) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      throw new Meteor.Error(
        'Boards.methods.setName.not-logged-in',
        'Must be logged in to change the name of a board.'
      );
    }
    /*
     * TODO:
     * maybe should check if not exists a board with the given id.
     */
    const board = Boards.findOne({ _id: boardId });
    if (!board.editableBy(this.userId)) {
      throw new Meteor.Error(
        'Boards.methods.setName.access-denied',
        'Cannot change the name of a board that is not yours.'
      );
    }

    board.update({ _id: boardId }, { $set: { name: newName } });
  },
});

/*
 * TODO:
 * Attach method to a namespace, like Boards.methods.makePrivate
 */
const remove = new ValidatedMethod({
  // The name of the method, sent over the wire. Same as the key provided
  // when calling Meteor.methods
  name: 'Boards.methods.remove',
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
      regEx: SimpleSchema.RegEx.Id,
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
        'Must be logged in to remove a board.'
      );
    }
    /*
     * TODO:
     * maybe should check if not exists a board with the given id.
     */
    const board = Boards.findOne({ _id: boardId });

    if (!board.editableBy(this.userId)) {
      throw new Meteor.Error(
        'Boards.methods.remove.access-denied',
        'Cannot remove a board that is not yours.'
      );
    }

    Boards.remove({ _id: boardId });
  },
});

export { insert, setPrivate, remove, setName };
