Meteor.publish('Board', function(username, name) {

  var user = Meteor.users.findOne({username: username});

  if ( !user ) {
    return this.ready();
  }

  return Boards.find({userId: user._id, name: name});

});

Meteor.publish('Board.names', function(username) {

  var user = Meteor.users.findOne({username: username});

  if ( !user ) {
    return this.ready();
  }

  return Boards.find({userId: user._id}, {fields: {'name': 1}});

});
