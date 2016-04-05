/**
 * We have to use this Collections global object
 * to store the collections, because we can not pass
 * a collection object as a param.
 * I throws a "Maximum Call Stack Excedeed" error
 */
//Collections.pins = new Mongo.Collection('pins');

Pins = new Mongo.Collection('pins');

PinSchema = new SimpleSchema({

  title: {
    type: String,
    min: 3,
    max: 10,
    unique: true,
  },

  imgUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  },

  createdAt: {
    type: Date,
    optional: true,
    autoValue: function() {
      if ( this.isInsert ) {
        return new Date;
      }
    }
  },

  userId: {
    type: String,
    autoValue: function() {
      if ( this.isInsert && this.userId) {
        return this.userId;
      }
    }
  },

  boardId: {
    type: String,
    optional: false
  }

});

PinMoveFormSchema = new SimpleSchema({

  boardId: {
    type: String,
    optional: true
  }

});

PinMoveForm = PinMoveFormSchema.namedContext('pinMoveForm');

Pins.attachSchema(PinSchema);