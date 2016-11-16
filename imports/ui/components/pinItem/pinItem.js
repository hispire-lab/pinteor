import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Mongo } from 'meteor/mongo';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import './pinItem.html';
import '../pinFormUpdate';

Template.pinItem.onCreated(function pinItemOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      pinReady: { type: Boolean },
      pin: { type: Mongo.Document, optional: true },
      'pin._id': { type: String }, // this should be a regex
      'pin.userId': { type: String }, // this should be a regex
      'pin.username': { type: String },
      'pin.boardId': { type: String },
      'pin.imageUrl': { type: String }, // this shoud be a regex
      'pin.description': { type: String },
      'pin.isPrivate': { type: Boolean },
      'pin.createdAt': { type: Date },
      'pin.boardCount': { type: Number },
    }).validate(Template.currentData());
  });
});

Template.pinItem.events({
  'click .js-edit'(event, templateInstance) {
    event.preventDefault();
    // Note: maybe i should pass the schema here too, not just the board
    Modal.show('pinFormUpdate', () => ({ pin: templateInstance.data.pin }));
  },
});
