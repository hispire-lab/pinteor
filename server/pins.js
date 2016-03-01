Meteor.publish('Pins', function(username, boardName) {

  var user = Meteor.users.findOne({username: username});

  if ( !user ) {
    return this.ready();
  }

  var board = Boards.findOne({userId: user._id, name: boardName});

  // returns all pins
  //if ( this.userId === user._id ) {

  return Pins.find({userId: user._id, boardId: board._id});
  //}

});
