Template.pin_move_form.onCreated(function() {
  var self = this;

  self.autorun(function() {
    if (FlowRouter.getRouteName() === 'boardPage') {
      var username = FlowRouter.getParam('username');
      self.subscribe('Board.names', username);
    }
  });

  self.boardNames = function() {
    return Boards.find().fetch();
  }

});

Template.pin_move_form.helpers({

  boardNames: function() {
    return Template.instance().boardNames();
  },
  
  boardIdsByName: function() {
    var boards = R.map(
        board => ({label: board.name, value: board._id})
      , Template.instance().boardNames()
    );

    return [
      {
        optgroup: 'Recently view',
        options: R.tail(boards)
      },
      {
        optgroup: 'all',
        options: boards
      }
    ]

  }

});
