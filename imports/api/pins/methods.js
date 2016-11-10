import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import slug from 'slug';
import Users from '../users/users.js';
import Boards from '../boards/boards.js';
import Pins from './pins.js';


export const pinsInsert = new ValidatedMethod({

  name: 'pins.methods.insertData',

  validate: Pins.schemas.form.validator(),

  run({ boardId, imageUrl, description, isPrivate }) {
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
      isPrivate,
    });
  },

});
