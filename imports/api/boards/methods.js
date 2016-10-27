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

export const insertData = new ValidatedMethod({

  name: 'boards.methods.insertData',

  validate: new SimpleSchema({
    name: { type: String },
    description: { type: String, optional: true },
    isPrivate: { type: Boolean },
  }).validator(),

  run({ name, description, isPrivate }) {
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

export const updateData = new ValidatedMethod({

  name: 'boards.methods.updateData',

  validate(idAndModifier) {
    const modifier = idAndModifier.modifier;
    new SimpleSchema({
      name: { type: String },
      description: { type: String, optional: true },
      isPrivate: { type: Boolean },
    }).validate(modifier, { modifier: true });
  },

  run(idAndModifier) {
    const _id = idAndModifier._id;
    const modifier = idAndModifier.modifier;
    // console.log('method update data: ', modifier);
    return Boards.update({ _id }, modifier);
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
