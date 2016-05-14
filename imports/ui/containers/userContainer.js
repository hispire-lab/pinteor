import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '../../api/users/users.js';
import UserPage from '../pages/userPage.jsx';

const UserContainer = createContainer(params => {
  // console.log(params);
  const { username } = params;
  // console.log(username);
  const userHandle = Meteor.subscribe('users.withBoards', username);
  const loading = !userHandle.ready();
  const user = Users.findOne({ username });
  // console.log(user);
  const userExists = !loading && !!user;
  return {
    loading,
    user,
    userExists,
    boards: userExists ? user.boards().fetch() : [],
  };
}, UserPage);

export default UserContainer;
