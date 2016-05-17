import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '../../api/users/users.js';
import UserPage from '../pages/userPage.jsx';

const UserContainer = createContainer(params => {
  const { username } = params;
  const userHandle = Meteor.subscribe('users.withBoards', username);
  const loading = !userHandle.ready();
  const user = Users.findOne({ username });
  const userExists = !loading && !!user;
  return {
    loading,
    user,
    userExists,
    boards: userExists ? user.boards().fetch() : [],
  };
}, UserPage);

export default UserContainer;
