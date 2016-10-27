import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './userLayout.html';
import '../components/userToolBar.js';
import '../components/userProfileHeader.js';
import '../pages/userPage.js';
import '../pages/boardsPage.js';

Template.userLayout.onCreated(function userLayoutOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      user: { type: Function },
      userReady: { type: Boolean },
      'regions.userLayout.main': { type: String },
    }).validate(Template.currentData());
  });
});
