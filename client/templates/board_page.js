Template.board_page.onCreated(function(){
  var self = this;

  self.autorun(function() {
    if (FlowRouter.getRouteName() === 'boardPage') {
      var username = FlowRouter.getParam('username');
      var boardName = FlowRouter.getParam('boardName');

      self.subscribe('Board', username, boardName);
      //that.subscribe('pins', username, boardName);
    }
  });

  self.board = function() {
    return Boards.findOne();
  }

  //that.pins = function() {
  //  return Collections.pins.find();
  //}

});

Template.board_page.helpers({

  isOwner: function(board) {
    return board.userId === Meteor.userId();
  },

  board: function() {
    return Template.instance().board();
  },

  //pins: function() {
  //  return Template.instance().pins();
  //}
})
