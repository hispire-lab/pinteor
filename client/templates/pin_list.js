Template.pin_list.onCreated(function(){
  var self = this;

  self.autorun(function() {
    if (FlowRouter.getRouteName() === 'boardPage') {
      var username = FlowRouter.getParam('username');
      var boardName = FlowRouter.getParam('boardName');
      self.subscribe('Pins', username, boardName);
    }
  });

  self.pins = function() {
    return Pins.find();
  }
});

Template.pin_list.helpers({
  pins: function() {
    return Template.instance().pins();
  }
});
