Template.pin_thumbnail.helpers({
  isOwner: function(pin) {
    return pin.userId === Meteor.userId();
  }
});

Template.pin_thumbnail.events({
  'click .js-edit-pin': function(event, instance){
    event.preventDefault();
    BlazeLayout.render('board_page', {
      pin_edit_form: 'pin_edit_form',
      pin: this.pin
    });
  }
});
