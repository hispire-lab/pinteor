/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { assert } from 'meteor/practicalmeteor:chai';
import StubCollections from 'meteor/hwillson:stub-collections';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { sinon } from 'meteor/practicalmeteor:sinon';
import Boards from '../../../../api/boards/boards.js';
import Users from '../../../../api/users/users.js';
import { withRenderedTemplate } from '../../../test-helpers.js';
import '../boardPageContainer.js';

describe('boardPageContainer', function () {
  const username = 'pitxon';
  const boardName = 'board A';
  const boardSlug = 'board-a';
  beforeEach(function () {
    StubCollections.stub([Users, Boards]);
    const getParamStub = sinon.stub(FlowRouter, 'getParam');
    getParamStub
      .withArgs('username')
      .returns(username);
    getParamStub
      .withArgs('boardSlug')
      .returns(boardSlug);
    sinon.stub(Meteor, 'subscribe', () => ({
      subscriptionId: 0,
      ready: () => true,
    }));
    Template.registerHelper('isCurrentUser', () => true);
  });
  afterEach(function () {
    StubCollections.restore();
    FlowRouter.getParam.restore();
    Meteor.subscribe.restore();
    Template.deregisterHelper('isCurrentUser');
  });
  it('renders correctly with simple data', function () {
    const user = Factory.create('user', { username });
    const board = Factory.create('board', {
      userId: user._id,
      username: user.username,
      name: boardName,
      slug: boardSlug,
    });

    withRenderedTemplate('boardPageContainer', {}, (el) => {
      // Note: for container makes sense that assertions test only
      // that the container renders his child template with the
      // proper data context
      const view = Blaze.getView($(el).find('#board-page').get(0));
      const viewData = Blaze.getData(view);

      assert.equal(board.username, viewData.board.username);
      assert.equal(true, viewData.boardReady);
      // assert.equal($(el).find('h1').first().text(), board.name);
      // assert.equal($(el).find('p').first().text(), board.description);
    });
  });
});
