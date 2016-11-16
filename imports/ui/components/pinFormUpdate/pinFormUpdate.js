import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Mongo } from 'meteor/mongo';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import Boards from '../../../api/boards/boards.js';
import Pins from '../../../api/pins/pins.js';
import './pinFormUpdate.html';
// import '../confirmBoardRemove';

Template.pinFormUpdate.onCreated(function pinFormUpdateOnCreated() {
  this.getUsername = () => FlowRouter.getParam('username');
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
      'pin.boardCount': { type: Number },
    }).validate(Template.currentData());
    this.subscribe('boards.list', this.getUsername());
  });
});

Template.pinFormUpdate.helpers({
  schema() {
    return Pins.schemas.updateForm;
  },
  templateModal() {
    return Template.instance();
  },
  boardIdOptions() {
    const boards = Boards.find().fetch();
    return boards.map(board => ({ label: board.name, value: board._id }));
  },
});

Template.pinFormUpdate.events({
  'click .js-cancel'(event, templateInstance) {
    event.preventDefault();
    Modal.hide(templateInstance);
  },
});
