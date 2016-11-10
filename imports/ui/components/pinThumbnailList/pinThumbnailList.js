import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Mongo } from 'meteor/mongo';
import './pinThumbnailList.html';
import '../pinThumbnailItem';

Template.pinThumbnailList.onCreated(function pinThumbnailListOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      pins: { type: Mongo.Cursor, optional: true },
      pinsReady: { type: Boolean },
    }).validate(Template.currentData());
  });
});
