import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/containers/appContainer.js';
import '../../ui/pages/homePage.js';
import '../../ui/containers/userPageContainer.js';
import '../../ui/containers/boardPageContainer.js';

FlowRouter.route('/', {
  name: 'App.home_page',
  action() {
    BlazeLayout.render('appContainer', {
      regions: {
        appLayout: { main: 'homePage' },
      },
    });
  },
});

FlowRouter.route('/:username', {
  name: 'App.user_page',
  action() {
    BlazeLayout.render('appContainer', {
      regions: {
        appLayout: { main: 'userPageContainer' },
        userLayout: { main: 'userPage' },
      },
    });
  },
});

FlowRouter.route('/:username/boards', {
  name: 'App.boards_page',
  action() {
    BlazeLayout.render('appContainer', {
      regions: {
        appLayout: { main: 'userPageContainer' },
        userLayout: { main: 'boardsPage' },
      },
    });
  },
});

FlowRouter.route('/:username/:boardSlug', {
  name: 'App.board_page',
  action() {
    BlazeLayout.render('appContainer', {
      regions: {
        appLayout: { main: 'boardPageContainer' },
      },
    });
  },
});
