/*
 * issue: self.board() sometimes returns an object with all the same
 * properties but with different _id, i dont know why this can
 * happen.
 */
Template.board_page.onCreated(function(){
  var self = this;

  self.autorun(function() {
    if (FlowRouter.getRouteName() === 'boardPage') {
      var username = FlowRouter.getParam('username');
      var boardName = FlowRouter.getParam('boardName');

      self.subscribe('Pins', username, boardName);
      self.subscribe('Board', username, boardName, function() {

        var board = self.board();
        if ( Meteor.userId() === board.userId) {
          Session.setDefaultPersistent('boardsLatestViewed', []);
          Session.setPersistent('boardsLatestViewed', R.compose(
              R.take(5)
            , R.uniqBy(obj => obj.name)
            , R.prepend(board)
            )(Session.get('boardsLatestViewed'))
          );
        }

      });
    }
  });

  self.board = function() {
    return Boards.findOne();
  }

  self.pinsCount = function() {
    return Pins.find().count();
  }

});

Template.board_page.helpers({

  isOwner: function(board) {
    return board.userId === Meteor.userId();
  },

  board: function() {
    return Template.instance().board();
  },

  pinsCount: function() {
    return Template.instance().pinsCount();
  }

});


Template.board_page.events({
  'click .js-edit-board': function(event, instance){
    event.preventDefault();
    BlazeLayout.render('board_page', {
      board_edit_form: 'board_edit_form',
      board: this
    });
  }
});
