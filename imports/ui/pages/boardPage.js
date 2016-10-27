import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './boardPage.html';
import '../components/boardItem.js';

Template.boardPage.onCreated(function boardPageOnCreated() {
  this.autorun(() => {
    new SimpleSchema({
      board: { type: Function },
      boardReady: { type: Boolean },
    }).validate(Template.currentData());
  });
});
