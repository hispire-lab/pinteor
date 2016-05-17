/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import React from 'react'; // eslint-disable-line no-unused-vars
import { mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
// import sinon from 'sinon';
import BoardPreview from './boardPreview.jsx'; // eslint-disable-line no-unused-vars

if (Meteor.isClient) {
  describe('<BoardPreview />', function () {
    it('renders name', function () {
      const wrapper = mount(<BoardPreview name="board A" />);
      chai.assert.equal('board A', wrapper.props().name);
    });
  });
}
