import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import './userToolBar.html';
import './boardFormInsert';

Template.userToolBar.onCreated(function userToolBarOnCreated() {
  this.autorun(() => {
    new SimpleSchema({

    }).validate(Template.currentData() || {});
  });
});

Template.userToolBar.events({
  'click .js-board-create'(event /* templateInstance */) {
    event.preventDefault();
    Modal.show('boardFormInsert');
  },
});
