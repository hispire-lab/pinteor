/*
 * NOTE: i need to import react here althought i am not using
 * it directly and it is being imported inside UserPage, seems
 * like react-dom render and react-mounter mount needs React to
 * be loaded first in order to work properly.
 */
import React from 'react'; // eslint-disable-line no-unused-vars
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/kadira:flow-router';

import AppLayout from '../../ui/layouts/appLayout.jsx';
/* eslint-disable no-unused-vars */
import UserContainer from '../../ui/containers/userContainer.js';
/* eslint-enable no-unused-vars */

FlowRouter.route('/:username', {
  name: 'userPage',
  action(params) {
    mount(AppLayout, {
      main: () => (<UserContainer {...params} />),
    });
  },
});
