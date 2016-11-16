import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Users from '../users/users.js';
import Boards from '../boards/boards.js';
import Pins from './pins.js';


export const pinsInsert = new ValidatedMethod({

  name: 'pins.methods.insertData',

  validate: Pins.schemas.form.validator(),

  run({ boardId, imageUrl, description }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'pins.insert.notLoggedIn',
        'Must be logged in to make a pin.'
      );
    }

    const board = Boards.findOne({ _id: boardId });
    if (!board) {
      throw new Meteor.Error(
        'pins.insert.boardNotFound',
        'Can\'t add a pin in a board that not exists.'
      );
    }

    const userId = this.userId;
    const username = Users.findOne({ _id: userId }, { fields: { username: 1 } }).username;
    return Pins.insert({
      userId,
      username,
      boardId,
      description,
      imageUrl,
    });
  },

});

export const pinsUpdate = new ValidatedMethod({

  name: 'pins.methods.updateData',

  validate({ _id, modifier }) { // eslint-disable-line no-unused-vars
    Pins.schemas.updateForm.validate(modifier, { modifier: true });
  },

  run({ _id, modifier }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'pins.update.notLoggedIn',
        'Must be logged in to edit a pin.'
      );
    }

    const pin = Pins.findOne({ _id });
    if (!pin.isEditableBy(this.userId)) {
      throw new Meteor.Error(
        'pins.update.accessDenied',
        'You don\'t have permission to edit this pin.'
      );
    }

    const fieldsToSet = modifier.$set;
    const board = Boards.findOne(
      { _id: modifier.$set.boardId },
      { fields: { isPrivate: 1 } }
    );
    fieldsToSet.isPrivate = board.isPrivate;
    fieldsToSet.updatedAt = new Date();
    return Pins.update({ _id }, { $set: fieldsToSet });
  },

});
