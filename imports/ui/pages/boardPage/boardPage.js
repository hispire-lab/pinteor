import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './boardPage.html';
import '../../components/boardItem';

Template.boardPage.onCreated(function boardPageOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      board: { type: Mongo.Document, optional: true },
      'board._id': { type: String }, // this should be a regex
      'board.userId': { type: String }, // this should be a regex
      'board.username': { type: String },
      'board.name': { type: String },
      'board.description': { type: String },
      'board.isPrivate': { type: Boolean },
      'board.createdAt': { type: Date },
      'board.imageUrl': { type: String }, // thos shoud be a regex
      'board.slug': { type: String },
      'board.pinCount': { type: Number },
      boardReady: { type: Boolean },
    }).validate(Template.currentData());
  });
});
