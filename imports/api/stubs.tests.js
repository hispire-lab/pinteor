/* eslint-disable func-names, prefer-arrow-callback */

import sinon from 'sinon';
import { Notifications } from './notifications/notifications.js';

export const stubInsertNotification = function () {
  return sinon.stub(
      Notifications.methods.insert,
      'call'
    );
};
