import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class NotificationsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const notification = doc;
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
    type: [SimpleSchema.RegEx.Id],
  },
  subject: {
    type: String,
  },
  body: {
    type: String,
  },
  objectId: {
    type: [SimpleSchema.RegEx.Id],
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

Notifications.helpers({

  unread() {
    return Notifications.find({
      userId: this.userId,
      isRead: { $eq: false },
    });
  },

});

export { Notifications };
