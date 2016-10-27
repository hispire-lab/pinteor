import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Users from '../users.js';
// import { Boards } from '../../boards';

Meteor.publish('users.current', function usersCurrentPublication() {
  const user = Users.find({ _id: this.userId }, { fields: Users.publicFields });
  if (user) {
    return user;
  }

  return this.ready();
});

// Note: instead of use Users.find, i need to use Users.findByUsername
// meteor built in function in order to avoid case sensitive problems.
Meteor.publish('users.single', function usersSinglePublication(username) {
  new SimpleSchema({
    username: { type: String },
  }).validate({ username });

  const user = Users.find({ username }, { fields: Users.publicFields });
  if (user) {
    return user;
  }

  return this.ready();
});


/*
 * FIXME: return only the public fields.
 * use simple Schema to check username param.
 * TODO: when an user with username param does not exists
 * return empty cursor.
 */
/* eslint-disable prefer-arrow-callback */
/*
Meteor.publishComposite('users.withBoards', function userWithBoards(username) {
  return {
    find() {
      return Users.find({ username }, { limit: 1 });
    },
    children: [{
      find(user) {
        // user public and private boards
        if (this.userId === user._id) {
          return Boards.find({ userId: user._id });
        }
        // user public boards
        return Boards.find({ userId: user._id, isPrivate: false });
      },
    }],
  };
});
*/
