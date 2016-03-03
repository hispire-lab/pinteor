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
