import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class BoardsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const board = doc;
    board.createdAt = board.createdAt || new Date();
    const result = super.insert(board, callback);
    return result;
  }
}

const Boards = new BoardsCollection('Boards');

Boards.schema = new SimpleSchema({
  name: {
    type: String,
    min: 3,
    max: 10,
    unique: true,
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

Boards.attachSchema(Boards.schema);

export { Boards };
