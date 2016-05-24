/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import React from 'react'; // eslint-disable-line no-unused-vars
import { mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';
import BoardPreview from './boardPreview.jsx'; // eslint-disable-line no-unused-vars

if (Meteor.isClient) {
  describe('<BoardPreview />', function () {
    it('renders name', function () {
      const wrapper = mount(<BoardPreview name="board A" />);
      chai.assert.equal('board A', wrapper.props().name);
    });
    it('renders pins count', function () {
      const wrapper = mount(<BoardPreview pinsCount="0" />);
      chai.assert.equal('0', wrapper.props().pinsCount);
    });
    it('renders description', function () {
      const wrapper = mount(<BoardPreview description="nice board" />);
      chai.assert.equal('nice board', wrapper.props().description);
    });
    it('calls editBoard when click in edit button', function () {
      const toggleEditBoardFormSpy = sinon.spy(BoardPreview.prototype, 'toggleEditBoardForm');
      const wrapper = mount(<BoardPreview />);
      wrapper.find('button').simulate('click');
      chai.assert.isTrue(toggleEditBoardFormSpy.calledOnce);
      toggleEditBoardFormSpy.restore();
    });
  });
}
