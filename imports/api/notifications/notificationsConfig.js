import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class NotificationsConfigCollection extends Mongo.Collection {
  insert(doc, callback) {
    const config = doc;
    config.pinsYourPin = config.pinsYourPin || true;
    config.likesYourPin = config.likesYourPin || true;
    const result = super.insert(config, callback);
    return result;
  }
}

const NotificationsConfig = new NotificationsConfigCollection('NotificationsConfig');

NotificationsConfig.Schema = new SimpleSchema({
  userId: {
    type: String,
    regEx: [SimpleSchema.RegEx.Id],
  },
  pinsYourPin: {
    type: Boolean,
  },
  likesYourPin: {
    type: Boolean,
  },
});

NotificationsConfig.attachSchema(NotificationsConfig.Schema);

export { NotificationsConfig };
