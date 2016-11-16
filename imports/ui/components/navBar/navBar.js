import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './navBar.html';

Template.navBar.onCreated(function navBarOnCreated() {
  this.autorun(() => {
    new SimpleSchema({}).validate(Template.currentData() || {});
  });
});

Template.navBar.events({
  'click .js-logout'(event) {
    event.preventDefault();
    Meteor.logout(console.log);
  },
});
