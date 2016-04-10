import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Boards } from '../boards/boards.js';

class PinsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const pin = doc;
    pin.createdAt = pin.createdAt || new Date();
    const result = super.insert(pin, callback);
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
    type: String,
    min: 3,
    max: 10,
    unique: true,
  },
  imgUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  createdAt: {
    type: Date,
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
     * a new pin isPrivate is setted by the board. If a remove this defaultValue
     * the Pin.methodsw tests not appears in the reporter.
     */
    defaultValue: false,
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
    return this.board().editableBy(userId);
  },

});

export { Pins };
