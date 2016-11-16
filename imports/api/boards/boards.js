import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import Chance from 'chance';
import slug from 'slug';
import boardCountDenormalizer from './boardCountDenormalizer.js';
import boardIsPrivateDenormalizer from './boardIsPrivateDenormalizer';

class BoardsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const board = doc;
    board.createdAt = board.createdAt || new Date();
    const result = super.insert(board, callback);
    boardCountDenormalizer.afterInsertBoard(board);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    boardIsPrivateDenormalizer.afterUpdateBoard(selector, modifier);
    boardCountDenormalizer.afterUpdateBoard(selector, modifier);
    return result;
  }
  remove(selector, callback) {
    const boards = this.find(selector).fetch();
    const result = super.remove(selector, callback);
    boardCountDenormalizer.afterRemoveBoards(boards);
    return result;
  }
}

const Boards = new BoardsCollection('boards');

function isNameAvailable() {  // eslint-disable-line consistent-return
  if (Meteor.isServer) {
    // Note: i have to use this.field('userId').value
    // instead of just this.userId here, this is because
    // this custom validation method is called from two
    // different schemas
    if (this.isUpdate) {
      const board = Boards.findOne({ _id: this.docId }, { fields: { name: 1 } });
      if (board.name === this.value) {
        return true;
      }
      const b = Boards.findOne({
        userId: this.field('userId').value,
        slug: slug(this.value),
      });
      if (b) {
        return 'notUnique';
      }
      return true;
    }
    if (this.isInsert) {
      const board = Boards.findOne({
        userId: this.field('userId').value,
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

Boards.schemas = {};

Boards.schemas.collection = new SimpleSchema({

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
    defaultValue: 'https://www.makeupgeek.com/content/wp-content/themes/makeupgeek/images/placeholder-square.svg',
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

  pinCount: {
    type: Number,
    defaultValue: 0,
  },

});

Boards.schemas.form = new SimpleSchema({

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
    defaultValue: false,
  },

});

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
  pinCount: 1,
};

const chance = new Chance();

// Note: if i create two board their _id are equal
// so i have to specify a new one on creation.
Factory.define('board', Boards, {
  // _id: () => Random.id(),
  userId: Random.id(),
  username: chance.name(),
  name() { return chance.word({ length: 6 }); },
  description: chance.sentence(),
  isPrivate: false,
  createdAt: new Date(),
  imageUrl: chance.url({ extensions: ['.jpg', '.gif', '.png'] }),
  slug() { return slug(this.name); },
  pinCount: 0,
});

export default Boards;
