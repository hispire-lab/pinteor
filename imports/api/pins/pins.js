import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Pins = new Mongo.Collection('Pins');
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
    optional: true,
    /*
     * FIXME:
     * the guide not make any use of the autovalue simpleschema functionality,
     * instead it creates a subclass of Mongo.Collection where overwrites the
     * insert method.
     * see: https://github.com/meteor/todos/blob/master/imports/api/todos/todos.js
     */
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      }
    },
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
