Template.pin_page.onCreated(function(){
  var self = this;

  self.autorun(function() {
    if (FlowRouter.getRouteName() === 'pinPage') {
      var pinId  = FlowRouter.getParam('pinId');
      self.subscribe('Pin', pinId);
    }
  });

  self.pin = function() {
    return Pins.findOne();
  }

});

Template.pin_page.helpers({

  isOwner: function(pin) {
    return pin.userId === Meteor.userId();
  },

  pin: function() {
    return Template.instance().pin();
  }

});

Template.pin_page.events({

  'click .js-edit-pin': function(event, instance) {
    event.preventDefault();
    BlazeLayout.render('pin_page', {
      pin_edit_form: 'pin_edit_form',
      pin: this
    });
  }

});
