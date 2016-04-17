import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/*
class UsersCollection extends Meteor.users {
  insert(doc, callback) {
    const user = doc;
    user.createdAt = user.createdAt || new Date();
    const result = super.insert(user, callback);
    return result;
  }
}
*/

// const Users = new UsersCollection('Users');

const Users = Meteor.users;

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
  following: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
  followers: {
    type: [SimpleSchema.RegEx.Id],
    optional: true,
  },
});

Users.attachSchema(Users.schema);

export { Users };
