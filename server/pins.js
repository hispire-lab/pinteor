Meteor.publish('Pins', function(username, boardName) {

  var user = Meteor.users.findOne({username: username});

  if ( !user ) {
    return this.ready();
  }

  var board = Boards.findOne({userId: user._id, name: boardName});
  return Pins.find({userId: user._id, boardId: board._id});

});

Meteor.publish('Pin', function(pinId) {

  return Pins.find({_id: pinId});

});
