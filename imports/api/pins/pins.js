import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Boards } from '../boards/boards.js';
import isPrivateDenormalizer from '../boards/isPrivateDenormalizer.js';
import likesCountDenormalizer from './likesCountDenormalizer.js';
import uuid from 'uuid';

class PinsCollection extends Mongo.Collection {

  insert(doc, callback) {
    const pin = doc;
    pin.createdAt = pin.createdAt || new Date();
    pin.title = pin.title || uuid.v4();
    pin.likesCount = pin.likesCount || 0;
    const result = super.insert(pin, callback);
    return result;
  }

  update(selector, modifier) {
    const result = super.update(selector, modifier);
    isPrivateDenormalizer.afterUpdatePin(selector, modifier);
    likesCountDenormalizer.afterUpdatePin(selector, modifier);
    return result;
  }
}

const Pins = new PinsCollection('Pins');

/*
 * We attach the schema to the namespace of Pins directly, which allows us to
 * check objects against this schema directly whenever we want, such as in a
 * form or Method.
 */
Pins.schema = new SimpleSchema({
  title: {
    /*
     * FIXME:
     * add regex for uuid
     *
     * we don't need a title for pins, should be renamed to slug
     */
    type: String,
  },
  imgUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  createdAt: {
    type: Date,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  /*
   * TODO:
   * work out the meaning of the following rule, the sample todo App uses it.
   * denyUpdate: true,
   */
  boardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  isPrivate: {
    type: Boolean,
    /*
     * FIXME:
     * have sense to remove the default value for isPrivate in pins, when we insert
     * a new pin isPrivate is setted by the board. If i remove this defaultValue
     * the Pin.methods tests not appears in the reporter.
     */
    defaultValue: false,
  },
  /*
   * FIXME:
   * rename this prop to likers.
   */
  likes: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
  likesCount: {
    type: Number,
  },
});

Pins.attachSchema(Pins.schema);

Pins.helpers({
  /*
   * returns the board in which a pin lives in
   */
  board() {
    return Boards.findOne({ _id: this.boardId });
  },
  /*
   * a pin is editable by a given user if the user can edit
   * the board in which the pin lives in
   */
  editableBy(userId) {
    return this.userId === userId;
  },
  isOwner(userId) {
    return this.userId === userId;
  },
});

export { Pins };
