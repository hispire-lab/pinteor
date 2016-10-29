import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import slug from 'slug';
import countDenormalizer from './countDenormalizer.js';

class BoardsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const board = doc;
    board.createdAt = board.createdAt || new Date();
    const result = super.insert(board, callback);
    countDenormalizer.afterInsertBoard(board);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    countDenormalizer.afterUpdateBoard(selector, modifier);
    return result;
  }
  remove(selector, callback) {
    const boards = this.find(selector).fetch();
    const result = super.remove(selector, callback);
    countDenormalizer.afterRemoveBoards(boards);
    return result;
  }
}

const Boards = new BoardsCollection('boards');

function isNameAvailable() {  // eslint-disable-line consistent-return
  if (Meteor.isServer) {
    if (this.isUpdate) {
      const board = Boards.findOne({ _id: this.docId }, { fields: { name: 1 } });
      if (board.name === this.value) {
        return true;
      }
      const b = Boards.findOne({
        userId: this.userId,
        slug: slug(this.value),
      });
      if (b) {
        return 'notUnique';
      }
      return true;
    }
    if (this.isInsert) {
      const board = Boards.findOne({
        userId: this.userId,
        slug: slug(this.value),
      });
      if (board) {
        return 'notUnique';
      }
      return true;
    }
  }
  if (Meteor.isClient) {
    if (this.isInsert) {
      Meteor.call('boards.methods.isSlugAvailable', this.value, (err, isNotAvailable) => {
        if (isNotAvailable) {
          Boards
            .schemas
            .form
            .namedContext('boardFormInsert')
            .addInvalidKeys([{ name: 'name', type: 'notUnique' }]);
        }
      });
    }
    if (this.isUpdate) {
      const board = Boards.findOne({ _id: this.docId }, { fields: { name: 1 } });
      if (board.name === this.value) {
        return true;
      }
      Meteor.call('boards.methods.isSlugAvailable', this.value, (err, isNotAvailable) => {
        if (isNotAvailable) {
          Boards
            .schemas
            .form
            .namedContext('boardFormUpdate')
            .addInvalidKeys([{ name: 'name', type: 'notUnique' }]);
        }
      });
    }
  }
}

Boards.schemas = {
  form: new SimpleSchema({
    name: {
      type: String,
      min: 3,
      max: 10,
      custom: isNameAvailable,
    },
    description: {
      type: String,
      optional: true,
    },
    isPrivate: {
      type: Boolean,
    },
  }),
  collection: new SimpleSchema({
    name: {
      type: String,
      min: 3,
      max: 10,
      custom: isNameAvailable,
    },
    slug: {
      type: String,
      autoValue() { // eslint-disable-line consistent-return
        const name = this.field('name');
        if (name.isSet) {
          return slug(name.value);
        }
      },
    },
    description: {
      type: String,
      optional: true,
    },
    imageUrl: {
      type: String,
      optional: true,
      regEx: SimpleSchema.RegEx.Url,
    },
    createdAt: {
      type: Date,
      optional: true,
    },
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    username: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      defaultValue: false,
    },
  }),
};

Boards.attachSchema(Boards.schemas.collection);
Boards.schemas.form.namedContext('boardFormInsert');
Boards.schemas.form.namedContext('boardFormUpdate');

Boards.helpers({
  isEditableBy(userId) {
    return this.userId === userId;
  },
});

Boards.publicFields = {
  userId: 1,
  username: 1,
  name: 1,
  slug: 1,
  description: 1,
  imageUrl: 1,
  isPrivate: 1,
};

export default Boards;
