import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import Boards from '../../api/boards/boards.js';
import './boardThumbnailListContainer.html';
import '../components/boardThumbnailList.js';

Template.boardThumbnailListContainer.onCreated(function boardThumbnailListContainer() {
  this.getUsername = () => FlowRouter.getParam('username');
  this.autorun(() => {
    this.subscribe('boards.list', this.getUsername());
  });
});

Template.boardThumbnailListContainer.helpers({
  boards() {
    return Boards.find();
  },
});
