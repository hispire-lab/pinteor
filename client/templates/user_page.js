Template.user_page.onCreated(function(){
  var self = this;

  self.autorun(function() {
    if (FlowRouter.getRouteName() === 'userPage') {

      self.subscribe('Users');
    }
  });

  self.user = function() {
    var username  = FlowRouter.getParam('username');
    return Meteor.users.findOne({username: username})
  }
});

Template.user_page.helpers({
  user: function() {
    return Template.instance().user();
  }
});
