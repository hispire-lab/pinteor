Template.board_page.onCreated(function(){
  var self = this;

  self.autorun(function() {
    if (FlowRouter.getRouteName() === 'boardPage') {
      var username = FlowRouter.getParam('username');
      var boardName = FlowRouter.getParam('boardName');

      self.subscribe('Board', username, boardName);
      self.subscribe('Pins', username, boardName);
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

})
