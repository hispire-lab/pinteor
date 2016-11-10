import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import Chance from 'chance';

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
  /*
  usersFollowing: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
  */
  /*
  usersFollowers: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
  */
  /*
  boardsFollowing: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
  */
  /*
  boardsFollowers: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
  */
  /*
  likesCount: {
    type: Number,
    optional: true,
    // FIXME: this should be moved to Accounts.onCreatedUser callback
    defaultValue: 0,
  },
  */
  boardCount: {
    type: Number,
    // optional: true,
    // FIXME: this should be moved to Accounts.onCreatedUser callback
    defaultValue: 0,
  },
  pinCount: {
    type: Number,
    defaultValue: 0,
  },
});

Users.attachSchema(Users.schema);

Users.publicFields = {
  username: 1,
  boardCount: 1,
  pinCount: 1,
};

const chance = new Chance();

Factory.define('user', Users, {
  username: chance.name(),
  createdAt: new Date(),
  boardsCount: 0,
  pinCount: 0,
});

export default Users;
