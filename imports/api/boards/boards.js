import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import isPrivateDenormalizer from './isPrivateDenormalizer.js';
import { Pins } from '../pins/pins.js';

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


class BoardsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const board = doc;
    board.createdAt = board.createdAt || new Date();
    board.slug = slug(board.name);
    const result = super.insert(board, callback);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    isPrivateDenormalizer.afterUpdateBoard(selector, modifier);
    return result;
  }
  remove(selector, callback) {
    Pins.remove({ boardId: selector._id });
    return super.remove(selector, callback);
  }
}

const Boards = new BoardsCollection('Boards');

Boards.schema = new SimpleSchema({
  name: {
    type: String,
    min: 3,
    max: 10,
    /*
     * FIXME:
     * this rule is not what we want, a board name should be unique
     * within a given user, that means that two different users can
     * have a board with same names.
     */
    // unique: true,
  },
  slug: {
    type: String,
    optional: true,
    /*
     * FIXME:
     * this rule is not what we want, a board slug should be unique
     * within a given user, that means that two different users can
     * have a board with same slugs.
     */
    // unique: true,
  },
  description: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  isPrivate: {
    type: Boolean,
    defaultValue: false,
  },
});

const boardCreateForm = Boards.schema.namedContext('boardCreateForm');

Boards.attachSchema(Boards.schema);

Boards.helpers({

  /*
   * only the user who created a board can edit it
   */
  editableBy(userId) {
    return this.userId === userId;
  },

});

export { Boards };
