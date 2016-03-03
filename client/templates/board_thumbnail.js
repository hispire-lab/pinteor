Template.board_thumbnail.helpers({
  isOwner: function(board) {
    return board.userId === Meteor.userId();
  }
});

Template.board_thumbnail.events({
  'click .js-edit-board': function(event, instance){
    event.preventDefault();
    BlazeLayout.render('user_page', {
      board_edit_form: 'board_edit_form',
      board: this.board
    });
  }
});
