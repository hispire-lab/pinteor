import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import './boardItem.html';
import './boardFormUpdate.js';

Template.boardItem.onCreated(function boardItemOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      board: { type: Object, blackbox: true },
    }).validate(Template.currentData());
  });
});


Template.boardItem.events({
  'click .js-edit'(event, templateInstance) {
    event.preventDefault();
    // Note: maybe i should pass the schema here too, not just the board
    Modal.show('boardFormUpdate', () => templateInstance.data);
  },
});
