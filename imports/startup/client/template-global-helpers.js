import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.registerHelper('isCurrentUser', userId => userId === Meteor.userId());

Template.registerHelper('consoleLog', o => console.log(o));
