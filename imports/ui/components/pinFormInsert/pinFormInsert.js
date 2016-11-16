import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import Boards from '../../../api/boards/boards.js';
import Pins from '../../../api/pins/pins.js';
import './pinFormInsert.html';

Template.pinFormInsert.onCreated(function pinFormInsertOnCreated() {
  this.getUsername = () => FlowRouter.getParam('username');
  this.autorun(() => {
    new SimpleSchema({}).validate(Template.currentData() || {});
    this.subscribe('boards.list', this.getUsername());
  });
});

Template.pinFormInsert.helpers({
  schema() {
    return Pins.schemas.form;
  },
  templateModal() {
    return Template.instance();
  },
  boardIdOptions() {
    const boards = Boards.find().fetch();
    return boards.map(board => ({ label: board.name, value: board._id }));
  },
});

Template.pinFormInsert.events({
  'click .js-cancel'(event, /* templateInstance */) {
    event.preventDefault();
    Modal.hide();
  },
});
