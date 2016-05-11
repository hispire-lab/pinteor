import { Meteor } from 'meteor/meteor';
/*
 * NOTE: i need to import react here althought i am not using
 * it directly and it is being imported inside UserPage, seems
 * like react-dom render needs React to be loaded first in order to
 * work properly.
 */
import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';
import UserPage from '../imports/ui/pages/userPage.jsx'; // eslint-disable-line no-unused-vars


Meteor.startup(() => {
  render(<UserPage />, document.getElementsByTagName('body')[0]);
});
