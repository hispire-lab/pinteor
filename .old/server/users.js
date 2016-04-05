Meteor.publish("Users", function (username) {
    return Meteor.users.find({}, {fields: {'username': 1}});
});
