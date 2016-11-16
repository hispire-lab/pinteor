import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Pins from '../../../api/pins/pins.js';
import './pinListContainer.html';
import '../../components/pinThumbnailList';

Template.pinListContainer.onCreated(function pinListContainer() {
  this.getUsername = () => FlowRouter.getParam('username');
  this.getboardSlug = () => FlowRouter.getParam('boardSlug');
  this.autorun(() => {
    new SimpleSchema({}).validate(Template.currentData || {});
    this.subscribe('pins.list', this.getUsername(), this.getboardSlug());
  });
});

Template.pinListContainer.helpers({
  pins() {
    return Pins.find();
  },
  pinsReady() {
    const instance = Template.instance();
    return instance.subscriptionsReady();
  },
});
