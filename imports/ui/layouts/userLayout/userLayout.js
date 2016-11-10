import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './userLayout.html';
import '../../components/userToolBar';
import '../../components/userProfileHeader';

Template.userLayout.onCreated(function userLayoutOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      user: { type: Function },
      userReady: { type: Boolean },
      'regions.userLayout.main': { type: String },
    }).validate(Template.currentData());
  });
});
