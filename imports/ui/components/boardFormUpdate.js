import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import Boards from '../../api/boards/boards.js';
import './boardFormUpdate.html';
import './confirmBoardRemove.js';

Template.boardFormUpdate.helpers({
  schema() {
    return Boards.schemas.form;
  },
  templateModal() {
    return Template.instance();
  },
});

Template.boardFormUpdate.events({
  // this is the current data context
  'click .js-delete'(event, templateInstance) {
    event.preventDefault();
    Modal.show('confirmBoardRemove', {
      deleteBoard: () => {
        Meteor.call('boards.methods.remove', { boardId: this.board._id }, (err /* result */) => {
          if (err) { console.log(err); }
          Modal.hide(templateInstance);
          FlowRouter.go('App.user_page', { username: this.board.username });
        });
      },
    });
  },
  'click .js-cancel'(event, templateInstance) {
    event.preventDefault();
    Modal.hide(templateInstance);
  },
});
