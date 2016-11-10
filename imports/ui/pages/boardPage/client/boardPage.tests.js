/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import { assert } from 'meteor/practicalmeteor:chai';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { withRenderedTemplate } from '../../../test-helpers.js';
import '../boardPage.js';

describe('boardPage', function () {
  it('renders correctly with simple data', function () {
    Template.registerHelper('isCurrentUser', () => true);

    const board = Factory.build('board');
    const data = { board, boardReady: true };
    withRenderedTemplate('boardPage', data, (el) => {
      assert.equal($(el).find('h1').first().text(), board.name);
      assert.equal($(el).find('p').first().text(), board.description);
    });

    Template.deregisterHelper('isCurrentUser');
  });
  it('renders loading when board is not ready', function () {
    const data = { board: undefined, boardReady: false };
    withRenderedTemplate('boardPage', data, (el) => {
      assert.equal($(el).find('p').first().text(), 'Loading...');
    });
  });
  it('renders not found when board not exists', function () {
    const data = { board: undefined, boardReady: true };
    withRenderedTemplate('boardPage', data, (el) => {
      assert.equal($(el).find('p').first().text(), 'Not found');
    });
  });
});
