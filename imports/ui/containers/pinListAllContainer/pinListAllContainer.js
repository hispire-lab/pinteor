import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Pins from '../../../api/pins/pins.js';
import './pinListAllContainer.html';
import '../../components/pinThumbnailList';

Template.pinListAllContainer.onCreated(function pinListAllContainer() {
  this.getUsername = () => FlowRouter.getParam('username');
  this.autorun(() => {
    new SimpleSchema({}).validate(Template.currentData || {});
    this.subscribe('pins.listAll', this.getUsername());
  });
});

Template.pinListAllContainer.helpers({
  pins() {
    return Pins.find();
  },
  pinsReady() {
    const instance = Template.instance();
    return instance.subscriptionsReady();
  },
});
