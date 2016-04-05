import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

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
});

Pins.attachSchema(Pins.schema);

export { Pins };
