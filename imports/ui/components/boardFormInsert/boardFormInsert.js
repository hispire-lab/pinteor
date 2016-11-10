import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import Boards from '../../../api/boards/boards.js';
import './boardFormInsert.html';

Template.boardFormInsert.helpers({
  schema() {
    return Boards.schemas.form;
  },
  templateModal() {
    return Template.instance();
  },
});

Template.boardFormInsert.events({
  'click .js-cancel'(event, /* templateInstance */) {
    event.preventDefault();
    Modal.hide();
  },
});
