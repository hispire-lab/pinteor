import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import slug from 'slug';

// Note: if i click in create board and fill the form
// with a name that already exists the form will print
// a Name is not available error which is fine, but if
// after that i close the modal and open it again
// i will see the error althought the form is empty,
// so i need a way to reset the form when the modal is
// closed.
AutoForm.addHooks('boardFormInsert', {
  onSuccess(/* formType, result */) {
    const username = FlowRouter.getParam('username');
    const boardSlug = slug(this.insertDoc.name);
    // Note: Modal.hide(this.template) not close the modal
    // because this.template refers to the autoform template
    // instance and not the modal one.
    Modal.hide(this.template.data.templateModal);
    // we should wait for the modal to close, and then redirect
    FlowRouter.go('App.board_page', { username, boardSlug });
  },
});

// Note: when i update the name of a board it redirects
// to the new page containing the board, i.e /:username/new-board-slug
// if i click the browser backwards button it goes to the previous
// board url which not longer exists, will be nice if in some way
// i can remove that entry from the browser history
AutoForm.addHooks('boardFormUpdate', {
  onSuccess(/* formType, result */) {
    const username = FlowRouter.getParam('username');
    const boardSlug = slug(this.updateDoc.$set.name);
    // Note: Modal.hide(this.template) not close the modal
    // because this.template refers to the autoform template
    // instance and not the modal one.
    Modal.hide(this.template.data.templateModal);
    // we should wait for the modal to close, and then redirect
    FlowRouter.go('App.board_page', { username, boardSlug });
  },
});
