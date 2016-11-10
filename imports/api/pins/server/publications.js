import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Users from '../../users/users.js';
import Pins from '../pins.js';

Meteor.publish('pins.single', function pinsSinglePublication(pinId) {
  new SimpleSchema({
    pinId: { type: String },
  }).validate({ pinId });

  const pin = Pins.findOne({ _id: pinId }, { fields: Pins.publicFields });
  if (!pin) {
    return this.ready();
  }
  // Note: see if i can use here pin.isEditableBy(this.userId)
  const currentUserIsOwner = pin.userId === this.userId;
  if (currentUserIsOwner) {
    return Pins.find({ _id: pinId }, { fields: Pins.publicFields });
  }

  if (pin.isPrivate) {
    return this.ready();
  }

  return Pins.find({ _id: pinId }, { fields: Pins.publicFields });
});

Meteor.publish('pins.list', function pinsListPublication(username) {
  new SimpleSchema({
    username: { type: String },
  }).validate({ username });

  const user = Users.findOne({ username });
  if (!user) {
    return this.ready();
  }

  const isCurrentUser = user._id === this.userId;
  if (isCurrentUser) {
    return Pins.find(
      { userId: user._id },
      { fields: Pins.publicFields }
    );
  }

  return Pins.find(
    { userId: user._id, isPrivate: false },
    { fields: Pins.publicFields }
  );
});
