import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './userProfileHeader.html';

Template.userProfileHeader.onCreated(function userProfileHeaderOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      user: { type: Object, blackbox: true },
    }).validate(Template.currentData());
  });
});
