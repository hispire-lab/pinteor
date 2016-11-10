/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
import { assert } from 'meteor/practicalmeteor:chai';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { withRenderedTemplate } from '../../../test-helpers.js';
import '../boardItem.js';

describe('boardItem', function () {
  it('renders correctly with simple data', function () {
    Template.registerHelper('isCurrentUser', () => false);

    const board = Factory.build('board');
    const data = { board };
    withRenderedTemplate('boardItem', data, (el) => {
      assert.equal($(el).find('h1').first().text(), board.name);
      assert.equal($(el).find('p').first().text(), board.description);
      assert.equal($(el).find('button').length, 0);
    });

    Template.deregisterHelper('isCurrentUser');
  });
  it('renders edit button if current user exists', function () {
    Template.registerHelper('isCurrentUser', () => true);

    const board = Factory.build('board');
    const data = { board };
    withRenderedTemplate('boardItem', data, (el) => {
      assert.equal($(el).find('h1').first().text(), board.name);
      assert.equal($(el).find('p').first().text(), board.description);
      assert.equal($(el).find('button').length, 1);
      assert.equal($(el).find('button').hasClass('js-edit'), true);
    });

    Template.deregisterHelper('isCurrentUser');
  });
});
