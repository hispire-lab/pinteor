Template.board_thumbnail.helpers({
  isOwner: function(board) {
    return board.userId === Meteor.userId();
  }
});
