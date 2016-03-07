Meteor.publish('Pins', function(username, boardName) {

  var user = Meteor.users.findOne({username: username});

  if ( !user ) {
    return this.ready();
  }

  var board = Boards.findOne({userId: user._id, name: boardName});
  return Pins.find({userId: user._id, boardId: board._id});

});

Meteor.publish('Pin', function(pinId, userId) {

  var pinCursor = Pins.find({_id: pinId});
  var pin = pinCursor.fetch()[0];
  var board = Boards.findOne({_id: pin.boardId});

  // user owns the pin
  if ( userId === pin.userId ) {
    return pinCursor;
  }
  // user not owns the pin
  else {
    if ( board.isPrivate ) {
      return this.ready();
    }
    else {
      return pinCursor
    }
  }

});
