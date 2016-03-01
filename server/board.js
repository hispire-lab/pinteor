Meteor.publish('Board', function(username, name) {

  var user = Meteor.users.findOne({username: username});

  if ( !user ) {
    return this.ready();
  }

  return Boards.find({userId: user._id, name: name});

});
