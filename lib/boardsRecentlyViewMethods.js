Meteor.methods({
  'BoardsRecentlyView.get': function(username) {
    var user = Meteor.users.findOne({username: username});
    return BoardsRecentlyView.find({userId: user._id});
  },

  'BoardsRecentlyView.update': function(username, latest) {
    var user = Meteor.users.findOne({username: username});
    return BoardsRecentlyView.update({userId: user_.id}, {$set: {latest: latest}});
  },

});
