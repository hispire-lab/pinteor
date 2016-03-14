BoardsRecentlyView = new Mongo.Collection('boardsRecentlyView');

BoardsRecentlyViewSchema = new SimpleSchema({
  userId: {
    type: String
  },

  lastest: {
    type: [String]
  }
});

BoardsRecentlyView.attachSchema(BoardsRecentlyViewSchema);
