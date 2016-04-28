import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class NotificationsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const notification = doc;
    notification.subject = '';
    notification.body = '';
    notification.isRead = false;
    notification.createdAt = notification.createdAt || new Date();
    const result = super.insert(notification, callback);
    return result;
  }
}

const Notifications = new NotificationsCollection('Notifications');

/*
 * example of notification:
 *
 * objectType -> Pin 'PinFavorited'
 * subject -> 'Your pin has been favorited'
 * body -> '<User X> has favorited your Caramel Cream Cakes pin!'
 */
Notifications.Schema = new SimpleSchema({
  userId: {
    type: String,
    regEx: [SimpleSchema.RegEx.Id],
  },
  senderId: {
    type: String,
    regEx: [SimpleSchema.RegEx.Id],
  },
  subject: {
    type: String,
    optional: true,
  },
  body: {
    type: String,
    optional: true,
  },
  objectId: {
    type: String,
    regEx: [SimpleSchema.RegEx.Id],
  },
  objectType: {
    type: String,
  },
  isRead: {
    type: Boolean,
  },
  sendAt: {
    type: Date,
    optional: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
});

Notifications.attachSchema(Notifications.Schema);

Notifications.helpers({});

export { Notifications };
