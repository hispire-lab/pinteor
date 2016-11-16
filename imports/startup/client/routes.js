import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
// Note: i think that i should move all this imports less the appContainer one
// into the appLayout component
import '../../ui/containers/appContainer';
import '../../ui/containers/userPageContainer';
import '../../ui/containers/boardPageContainer';
import '../../ui/containers/boardThumbnailListContainer';
import '../../ui/containers/pinContainer';
import '../../ui/containers/pinListAllContainer';
import '../../ui/pages/homePage';
import '../../ui/pages/userPage';

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

// Note: this route actually works because App.board_page
// is matching first, /:username/:boardSlug matchs /pin/:pinId
FlowRouter.route('/pin/:pinId', {
  name: 'App.pin_page',
  action() {
    BlazeLayout.render('appContainer', {
      regions: {
        appLayout: { main: 'pinContainer' },
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
        userLayout: { main: 'boardThumbnailListContainer' },
      },
    });
  },
});

FlowRouter.route('/:username/pins', {
  name: 'App.pins_page',
  action() {
    BlazeLayout.render('appContainer', {
      regions: {
        appLayout: { main: 'userPageContainer' },
        userLayout: { main: 'pinListAllContainer' },
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
