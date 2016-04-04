Meteor.publish('Boards', function(username) {

  var user = Meteor.users.findOne({username: username});

  if ( !user ) {
    return this.ready();
  }
  // returns all boards
  if ( this.userId === user._id ) {
    return Boards.find({userId: user._id});
  }
  // returns just public boards
  else {
    return Boards.find({userId: user._id, isPrivate: false});
  }
});
