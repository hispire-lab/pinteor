import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Mongo } from 'meteor/mongo';
import './pinThumbnailItem.html';

Template.pinThumbnailItem.onCreated(function pinThumbnailItemOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      pin: { type: Mongo.Document },
      'pin._id': { type: String }, // this should be a regex
      'pin.userId': { type: String }, // this should be a regex
      'pin.username': { type: String },
      'pin.boardId': { type: String },
      'pin.imageUrl': { type: String }, // this shoud be a regex
      'pin.description': { type: String },
      'pin.isPrivate': { type: Boolean },
      'pin.createdAt': { type: Date },
    }).validate(Template.currentData());
  });
});
