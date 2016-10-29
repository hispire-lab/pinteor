import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { isEmpty, pickBy } from 'ramda';
import './appLayout.html';
import '../components/navBar.js';

Template.appLayout.onCreated(function appLayoutOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      currentUserReady: { type: Boolean },
      // 'regions.appLayout.main': { type: String },
      // 'regions.userLayout.main': { type: String },
      regions: { type: Object, blackbox: true },
    }).validate(Template.currentData());
  });
});

Template.appLayout.helpers({
  dataArgs(regions) {
    const childRegions = pickBy((val, key) => key !== 'appLayout', regions);
    return isEmpty(childRegions) ? '' : { regions: childRegions };
  },
});
