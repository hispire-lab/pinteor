import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Users = new Mongo.Collection('Users');

Users.schema = new SimpleSchema({
  username: {
    type: String,
    /*
     * For accounts-password, either emails or username is required, but not both.
     * It is OK to make this optional here because the accounts-password package
     * does its own validation. Third-party login packages may not require either.
     * Adjust this schema as necessary for your usage.
     */
    optional: true,
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
});

Meteor.users.attachSchema(Users.schema);

export { Users };
