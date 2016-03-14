Template.board_page.onCreated(function(){
  var self = this;

  var username, boardName;

  self.autorun(function() {
    if (FlowRouter.getRouteName() === 'boardPage') {
      username = FlowRouter.getParam('username');
      boardName = FlowRouter.getParam('boardName');

      self.subscribe('Board', username, boardName);
      self.subscribe('Pins', username, boardName);
    }
  });

  Session.setDefaultPersistent('latest', []);
  var store = Session.get('latest');
  store.push(boardName);
  Session.setPersistent('latest', store);
  console.log(Session.get('latest'))


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
  },

  boardsRecentlyView: function() {
    return Session.get('latest');
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
