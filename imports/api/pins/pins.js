// import { Meteor } from 'meteor/meteor';
import R from 'ramda';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import Chance from 'chance';
import Boards from '../boards/boards.js';
import pinCountDenormalizer from './pinCountDenormalizer.js';
import imageUrlDenormalizer from './imageUrlDenormalizer.js';

class PinsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const pin = doc;
    pin.createdAt = pin.createdAt || new Date();
    pin.updatedAt = pin.updatedAt || pin.createdAt;
    const board = Boards.findOne({ _id: pin.boardId }, { fields: { isPrivate: 1 } });
    pin.isPrivate = board.isPrivate;
    const result = super.insert(doc, callback);
    pinCountDenormalizer.afterInsertPin(pin);
    imageUrlDenormalizer.afterInsertPin(pin);
    return result;
  }

  update(selector, modifier) {
    // Note: i have to clone here the modifier object because
    // super.update is mutating it, so properties like
    // oldBoardId that are not part of the collection deleted
    // from the modfier object and we need that props to be
    // used inside the pinCountDenormalizer
    const result = super.update(selector, R.clone(modifier));
    imageUrlDenormalizer.afterUpdatePin(selector, R.clone(modifier));
    pinCountDenormalizer.afterUpdatePin(selector, R.clone(modifier));
    return result;
  }

  remove(selector, callback) {
    return super.remove(selector, callback);
  }
}

const Pins = new PinsCollection('pins');

Pins.schemas = {};

// url, description, dropdown with all boards, search boards box, create a board

Pins.schemas.collection = new SimpleSchema({

  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  username: {
    type: String,
  },

  boardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  isPrivate: {
    type: Boolean,
  },

  imageUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },

  description: {
    type: String,
    optional: true,
  },

  createdAt: {
    type: Date,
    // optional: true,
  },

  updatedAt: {
    type: Date,
  },

});

Pins.schemas.form = new SimpleSchema({

  boardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  imageUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },

  description: {
    type: String,
    optional: true,
  },

});

Pins.schemas.updateForm = new SimpleSchema({

  oldBoardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  boardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  description: {
    type: String,
    optional: true,
  },

});

Pins.attachSchema(Pins.schemas.collection);
Pins.schemas.form.namedContext('pinFormInsert');
// Pins.schemas.form.namedContext('pinFormUpdate');
Pins.schemas.updateForm.namedContext('pinFormUpdate');

Pins.helpers({
  isEditableBy(userId) {
    return this.userId === userId;
  },
});

Pins.publicFields = {
  userId: 1,
  username: 1,
  boardId: 1,
  isPrivate: 1,
  description: 1,
  imageUrl: 1,
  createdAt: 1,
  updatedAt: 1,
};

const chance = new Chance();

Factory.define('pin', Pins, {
  userId: Random.id(),
  username: chance.name(),
  boardId: Random.id(),
  imageUrl: () => chance.url({ extensions: ['.jpg', '.gif', '.png'] }),
  description: () => chance.sentence(),
  isPrivate: false,
  createdAt: new Date(),
});

export default Pins;
