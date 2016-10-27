import { Template } from 'meteor/templating';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import './confirmBoardRemove.html';

Template.confirmBoardRemove.events({
  'click .js-cancel'(event, templateInstance) {
    event.preventDefault();
    Modal.hide(templateInstance);
  },
  'click .js-delete'(event, templateInstance) {
    event.preventDefault();
    // Note: deleteboard call should be inside onhide modal callback
    Modal.hide(templateInstance);
    templateInstance.data.deleteBoard();
  },
});
