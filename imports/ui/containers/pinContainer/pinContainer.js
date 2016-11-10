import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Pins from '../../../api/pins/pins.js';
import './pinContainer.html';
import '../../components/pinItem';

Template.pinContainer.onCreated(function pinContainer() {
  this.getPinId = () => FlowRouter.getParam('pinId');
  this.autorun(() => {
    new SimpleSchema({}).validate(Template.currentData || {});
    this.subscribe('pins.single', this.getPinId());
  });
});

Template.pinContainer.helpers({
  pin() {
    return Pins.findOne();
  },
  pinReady() {
    const instance = Template.instance();
    return instance.subscriptionsReady();
  },
});
