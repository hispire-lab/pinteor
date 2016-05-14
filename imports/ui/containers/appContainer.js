import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import AppLayout from '../layouts/appLayout.jsx';

const AppContainer = createContainer(props => {
  return {
    user: Meteor.user(),
  };
}, AppLayout);

export default AppContainer;
