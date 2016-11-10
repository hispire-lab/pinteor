import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Mongo } from 'meteor/mongo';
import './boardThumbnailItem.html';

Template.boardThumbnailItem.onCreated(function boardThumbnailItemOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      // Note: i have to use here Mongo.Document instead Object
      // for type checking the board, this is because with type
      // Object the board passed throught Boards.findOne() returns
      // an object of type Document.
      // objects generated with both findOne and Factory.build
      // pass the type Document test while only the ones
      // generated with Factory.build pass the type Object test
      board: { type: Mongo.Document },
      'board._id': { type: String }, // this should be a regex
      'board.userId': { type: String }, // this should be a regex
      'board.username': { type: String },
      'board.name': { type: String },
      'board.description': { type: String },
      'board.isPrivate': { type: Boolean },
      'board.createdAt': { type: Date },
      'board.imageUrl': { type: String }, // thos shoud be a regex
      'board.slug': { type: String },
    }).validate(Template.currentData());
  });
});
