import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Pins from '../../../api/pins/pins.js';
import './pinThumbnailListContainer.html';
import '../../components/pinThumbnailList';

Template.pinThumbnailListContainer.onCreated(function pinThumbnailListContainer() {
  this.getUsername = () => FlowRouter.getParam('username');
  this.autorun(() => {
    new SimpleSchema({}).validate(Template.currentData || {});
    this.subscribe('pins.list', this.getUsername());
  });
});

Template.pinThumbnailListContainer.helpers({
  pins() {
    return Pins.find();
  },
  pinsReady() {
    const instance = Template.instance();
    return instance.subscriptionsReady();
  },
});
