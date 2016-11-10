import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './homePage.html';

Template.homePage.onCreated(function homePageOnCreated() {
  this.autorun(() => {
    new SimpleSchema({}).validate(Template.currentData() || {});
  });
});
