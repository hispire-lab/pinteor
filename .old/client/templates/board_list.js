Template.board_list.onCreated(function(){
  var self = this;

  self.autorun(function() {
    if (FlowRouter.getRouteName() === 'userPage') {
      var username = FlowRouter.getParam('username');
      self.subscribe('Boards', username);
    }
  });

  self.boards = function() {
    return Boards.find();
  }
});

Template.board_list.helpers({
  boards: function(){
    return Template.instance().boards();
  }
});
