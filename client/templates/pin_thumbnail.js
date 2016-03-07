Template.pin_thumbnail.onCreated(function() {
  var self = this;

  self.autorun(function() {
    if (FlowRouter.getRouteName() === 'boardPage') {
      var username = FlowRouter.getParam('username');
      self.subscribe('Board.names', username);
    }
  });


});

Template.pin_thumbnail.helpers({
  isOwner: function(pin) {
    return pin.userId === Meteor.userId();
  },

  boardNames: function() {
    return console.log(Boards.findOne());
  }

});

Template.pin_thumbnail.events({
  'click .js-edit-pin': function(event, instance){
    event.preventDefault();
    BlazeLayout.render('board_page', {
      pin_edit_form: 'pin_edit_form',
      pin: this.pin
    });
  }

});
