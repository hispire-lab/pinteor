/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';

if (Meteor.isServer) {
  describe('boards', function () {
    it('should be ok', function () {
      assert.equal(true, true);
    });
  });
}
