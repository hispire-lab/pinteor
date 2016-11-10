import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Mongo } from 'meteor/mongo';
import './boardThumbnailList.html';
import '../boardThumbnailItem';

Template.boardThumbnailList.onCreated(function boardThumbnailListOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      boards: { type: Mongo.Cursor, optional: true },
      boardsReady: { type: Boolean },
    }).validate(Template.currentData());
  });
});
