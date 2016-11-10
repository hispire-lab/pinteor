import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Boards from '../../../api/boards/boards.js';
import './boardPageContainer.html';
import '../../pages/boardPage';

Template.boardPageContainer.onCreated(function boardPageContainer() {
  this.getUsername = () => FlowRouter.getParam('username');
  this.getBoardSlug = () => FlowRouter.getParam('boardSlug');
  this.autorun(() => {
    new SimpleSchema({}).validate(Template.currentData || {});
    this.subscribe('boards.single', this.getUsername(), this.getBoardSlug());
  });
});

Template.boardPageContainer.helpers({
  // i can use just Boards.findOne()
  // beacuse the subscription already
  // garatizes a single board
  board() {
    // const instance = Template.instance();
    // const boardSlug = instance.getBoardSlug();
    // return () => Boards.findOne({ slug: boardSlug });
    // return Boards.findOne({ slug: boardSlug });
    return Boards.findOne();
  },
  boardReady() {
    const instance = Template.instance();
    return instance.subscriptionsReady();
  },
});
