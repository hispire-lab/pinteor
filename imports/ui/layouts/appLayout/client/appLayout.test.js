/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'meteor/practicalmeteor:chai';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { $ } from 'meteor/jquery';
import { withRenderedTemplate } from '../../../test-helpers.js';
import '../appLayout.js';

describe('appLayout', function () {
  it.skip('renders correctly with simple data', function () {
    Template.registerHelper('logginIn', () => false);
    Template.registerHelper('currentUser', () => true);
    const currentUserReady = true;
    const regions = { appLayout: { main: 'userPageContainer' } };
    const data = { currentUserReady, regions };
    // Note: i need to test here that appLayout renders the navbar
    // component with an empty context and that renders the template
    // defined in regions.appLayout.main with a data context containing
    // the proper regions object if should have any.
    withRenderedTemplate('appLayout', data, (el) => {
      const navBarView = Blaze.getView($(el).find('.navbar').get(0));
      const navBarData = Blaze.getData(navBarView);
      assert.equal(navBarData, '');
    });
    Template.deregisterHelper('logginIn');
    Template.deregisterHelper('currentUser');
  });
  it('renders login in message when user is login', function () {
    Template.registerHelper('logginIn', () => true);
    const currentUserReady = false;
    const regions = { appLayout: { main: '' } };
    const data = { currentUserReady, regions };

    withRenderedTemplate('appLayout', data, (el) => {
      assert.equal($(el).find('p').first().text(), 'Login in...');
    });

    Template.deregisterHelper('logginIn');
  });
  it('renders loading message when user is not ready', function () {
    Template.registerHelper('logginIn', () => false);
    const currentUserReady = false;
    const regions = { appLayout: { main: '' } };
    const data = { currentUserReady, regions };

    withRenderedTemplate('appLayout', data, (el) => {
      assert.equal($(el).find('p').first().text(), 'Loading...');
    });

    Template.deregisterHelper('logginIn');
  });
  it('renders loggin buttons when current user not exists', function () {
    Template.registerHelper('logginIn', () => false);
    Template.registerHelper('currentUser', () => false);
    const currentUserReady = true;
    const regions = { appLayout: { main: '' } };
    const data = { currentUserReady, regions };

    withRenderedTemplate('appLayout', data, (el) => {
      assert.equal($(el).find('div#login-buttons').length, true);
    });

    Template.deregisterHelper('logginIn');
    Template.deregisterHelper('currentUser');
  });
});
