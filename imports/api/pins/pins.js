// import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import Chance from 'chance';
import pinCountDenormalizer from './pinCountDenormalizer.js';

class PinsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const pin = doc;
    pin.createdAt = pin.createdAt || new Date();
    const result = super.insert(doc, callback);
    pinCountDenormalizer.afterInsertPin(pin);
    return result;
  }

  update(selector, modifier) {
    return super.update(selector, modifier);
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
    defaultValue: false,
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
    optional: true,
  },
});

Pins.schemas.form = new SimpleSchema({
  boardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  isPrivate: {
    type: Boolean,
    defaultValue: false,
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

Pins.attachSchema(Pins.schemas.collection);
Pins.schemas.form.namedContext('pinsFormInsert');
Pins.schemas.form.namedContext('pinsFormUpdate');

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
