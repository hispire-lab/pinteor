Boards = new Mongo.Collection('boards');

BoardSchema = new SimpleSchema({
  name: {
    type: String,
    min: 3,
    max: 10,
    unique: true
  },

  description: {
    type: String,
    optional: true
  },

  isPrivate: {
    type: Boolean,
    defaultValue: false
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
      if ( this.isInsert && this.userId ) {
        return this.userId;
      }
    }
  }
});

Boards.attachSchema(BoardSchema);
