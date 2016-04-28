import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Boards } from '../boards/boards.js';
import { Pins } from '../pins/pins.js';
import { Notifications } from '../notifications/notifications.js';

const Users = Meteor.users;

Users.schema = new SimpleSchema({
  username: {
    type: String,
    // For accounts-password, either emails or username is required, but not both.
    // It is OK to make this optional here because the accounts-password package
    // does its own validation. Third-party login packages may not require either.
    // Adjust this schema as necessary for your usage.
    // optional: true,
  },
  createdAt: {
    type: Date,
  },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true,
  },
  following: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
  followers: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
  likesCount: {
    type: Number,
    optional: true,
    // FIXME: this should be moved to Accounts.onCreatedUser callback
    defaultValue: 0,
  },
});

Users.attachSchema(Users.schema);

Users.helpers({

  boards() {
    return Boards.find({ userId: this._id });
  },

  pins() {
    const boardIds = this.boards().map(board => board._id);
    return Pins.find({ boardId: { $in: boardIds } }).fetch();
  },

  pinsLiked() {
    const boardIds = this.boards().map(board => board._id);
    return Pins.find({
      boardId: { $in: boardIds },
      likesCount: { $gt: 0 },
    }).fetch();
  },

  unreadNotifications() {
    return Notifications.find({
      userId: this._id,
      isRead: { $eq: false },
    });
  },

});

export { Users };
