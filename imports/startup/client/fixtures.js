import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Meteor.loginWithPassword('pitxon', 'password');
});
