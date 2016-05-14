import { Meteor } from 'meteor/meteor';
/*
 * NOTE: i need to import react here althought i am not using
 * it directly and it is being imported inside UserPage, seems
 * like react-dom render and react-mounter mount needs React to
 * be loaded first in order to work properly.
 */
import React from 'react'; // eslint-disable-line no-unused-vars
import UserPage from '../imports/ui/pages/userPage.jsx'; // eslint-disable-line no-unused-vars
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import UserContainer from '../imports/ui/containers/userContainer.js';
import AppContainer from '../imports/ui/containers/appContainer.js';
import AppLayout from '../imports/ui/layouts/appLayout.jsx';


FlowRouter.route('/:username', {
  name: 'userPage',
  action(params) {
    mount(AppLayout, {
      main: () => (<UserContainer {...params} />),
    });
  },
});
