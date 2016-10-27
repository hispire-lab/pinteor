import { Template } from 'meteor/templating';
import './appContainer.html';
import '../layouts/appLayout.js';

Template.appContainer.onCreated(function appContainerOnCreated() {
  this.autorun(() => {
    this.subscribe('users.current');
  });
});

Template.appContainer.helpers({
  currentUserReady() {
    const instance = Template.instance();
    return instance.subscriptionsReady();
  },
});
