import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Boards from '../../../api/boards/boards.js';
import './boardThumbnailListContainer.html';
import '../../components/boardThumbnailList';

Template.boardThumbnailListContainer.onCreated(function boardThumbnailListContainer() {
  this.getUsername = () => FlowRouter.getParam('username');
  this.autorun(() => {
    new SimpleSchema({}).validate(Template.currentData || {});
    this.subscribe('boards.list', this.getUsername());
  });
});

Template.boardThumbnailListContainer.helpers({
  boards() {
    return Boards.find();
  },
  boardsReady() {
    const instance = Template.instance();
    return instance.subscriptionsReady();
  },
});
