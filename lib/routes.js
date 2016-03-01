if (Meteor.isClient) {

FlowRouter.route('/', {
  name: 'homePage',
  action(params, queryParams) {
    BlazeLayout.render('main', {main: 'home_page'});
  }
});

FlowRouter.route('/:username', {
  name: 'userPage',
  action(params, queryParams) {
    BlazeLayout.render('main', {main: 'user_page'});
  }
});

FlowRouter.route('/:username/:boardName', {
  // the URL must be normalize. Lowercase and replace ' ' with '-'
  name: 'boardPage',
  action(params, queryParams) {
    BlazeLayout.render('main', {main: 'board_page'});
  }
});

};
