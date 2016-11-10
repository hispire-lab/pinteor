import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import slug from 'slug';
import Boards from './boards.js';
import Users from '../users/users.js';

export const isSlugAvailable = new ValidatedMethod({

  name: 'boards.methods.isSlugAvailable',

  validate: null,

  run(name) {
    return !!Boards.findOne({ userId: this.userId, slug: slug(name) });
  },
});

export const boardsInsert = new ValidatedMethod({

  name: 'boards.methods.insertData',

  validate: Boards.schemas.form.validator(),

  run({ name, description, isPrivate }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'boards.insert.notLoggedIn',
        'Must be logged in to make a board.'
      );
    }

    const userId = this.userId;
    const username = Users.findOne({ _id: userId }, { fields: { username: 1 } }).username;
    const imageUrl = 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg';
    return Boards.insert({
      userId,
      name,
      description,
      username,
      imageUrl,
      isPrivate,
    });
  },

});

export const boardsUpdate = new ValidatedMethod({

  name: 'boards.methods.updateData',

  validate({ _id, modifier }) { // eslint-disable-line no-unused-vars
    new SimpleSchema({
      name: { type: String },
      description: { type: String, optional: true },
      isPrivate: { type: Boolean },
    }).validate(modifier, { modifier: true });
  },

  run({ _id, modifier }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'boards.update.notLoggedIn',
        'Must be logged in to update a board.'
      );
    }

    const board = Boards.findOne({ _id });
    if (!board.isEditableBy(this.userId)) {
      throw new Meteor.Error(
        'boards.update.accessDenied',
        'You don\'t have permission to edit this board.'
      );
    }

    const fieldsToSet = modifier.$set;
    fieldsToSet.userId = this.userId;
    return Boards.update({ _id }, { $set: fieldsToSet });
  },

});

export const boardsRemove = new ValidatedMethod({

  name: 'boards.methods.remove',

  validate: new SimpleSchema({
    boardId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),

  run({ boardId }) {
    // Note: should add a check board.isEditableBy(this.userId)
    return Boards.remove(boardId);
  },

});
