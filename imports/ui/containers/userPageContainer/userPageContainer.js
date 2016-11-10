import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import Users from '../../../api/users/users.js';
import './userPageContainer.html';
import '../../layouts/userLayout';

Template.userPageContainer.onCreated(function userPageContainerOnCreated() {
  this.getUsername = () => FlowRouter.getParam('username');
  this.autorun(() => {
    this.subscribe('users.single', this.getUsername());
  });
});

Template.userPageContainer.helpers({
  user() {
    const instance = Template.instance();
    return () => Users.findOne({ username: instance.getUsername() });
  },
  userReady() {
    const instance = Template.instance();
    return instance.subscriptionsReady();
  },
});
