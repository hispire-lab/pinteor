import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import isPrivateDenormalizer from './isPrivateDenormalizer.js';
import boardsCountDenormalizer from './boardsCountDenormalizer';
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

    /*
     * NOTE: !board.isPrivate is checking for undefined and for falsy values,
     * so a board's privacy is setted to false when is explicitly setted via
     * a param in insert or when is not setted.
     */
    if (!board.isPrivate) {
      board.isPrivate = false;
    } else {
      board.isPrivate = true;
    }

    board.slug = slug(board.name);
    board.pinsCount = board.pinsCount || 0;
    const result = super.insert(board, callback);
    boardsCountDenormalizer.afterInsertBoard(board);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    isPrivateDenormalizer.afterUpdateBoard(selector, modifier);
    return result;
  }
  remove(selector, callback) {
    /*
     * NOTE: maybe instead of remove the pins by the boardId
     * will be nive to remove them thought the poin remove method.
     *
     * in order to do that is have to take all the pins with the boardId
     * and take its ids, the loop over the ids calling the pin remove method
     *
     * i.e
     * const pinIds = Pins.find({ boardId: selector._id }, { fields: { _id: 1 } }).fetch();
     * pinIds.map((pinId) => Pins.methods.remove({ pinId }));
     *
     * see: pinsCountDenormalizer.afterRemovePin
     */
    const board = this.findOne({ _id: selector._id });
    Pins.remove({ boardId: selector._id });
    const result = super.remove(selector, callback);
    boardsCountDenormalizer.afterRemoveBoard(selector, board);
    return result;
  }
}

const Boards = new BoardsCollection('Boards');

Boards.schema = new SimpleSchema({
  name: {
    type: String,
    min: 3,
    max: 10,
  },
  slug: {
    type: String,
    optional: true,
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
  },
  pinsCount: {
    type: Number,
  },
});

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
