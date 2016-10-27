import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import Boards from '../../api/boards/boards.js';
import './boardPageContainer.html';
import '../pages/boardPage.js';

Template.boardPageContainer.onCreated(function boardPageContainer() {
  this.getUsername = () => FlowRouter.getParam('username');
  this.getBoardSlug = () => FlowRouter.getParam('boardSlug');
  this.autorun(() => {
    this.subscribe('boards.single', this.getUsername(), this.getBoardSlug());
  });
});

Template.boardPageContainer.helpers({
  // i can use just Boards.findOne()
  // beacuse the subscription already
  // garatizes a single board
  board() {
    const instance = Template.instance();
    const boardSlug = instance.getBoardSlug();
    return () => Boards.findOne({ slug: boardSlug });
  },
  boardReady() {
    const instance = Template.instance();
    return instance.subscriptionsReady();
  },
});
