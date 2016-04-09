import { R } from 'meteor/ramda:ramda';
import { check } from 'meteor/check';
import { Pins } from '../pins/pins.js';

const isPrivateDenormalizer = {

  _updatePin(pinId, isPrivate) {
    Pins.update({ _id: pinId }, { $set: { isPrivate } });
  },

  afterUpdateBoard(selector, modifier) {
    // We only support very limited operations on todos
    check(modifier, { $set: Object });
    // We can only deal with $set modifiers, but that's all we do in this app
    if (R.has('isPrivate', modifier.$set)) {
      const pins = Pins.find({ boardId: selector._id }, { fields: { _id: 1 } });
      // check if the board has at least one pin, empty boards can exists.
      if (pins) {
        pins.forEach(pin => {
          this._updatePin(pin._id, modifier.$set.isPrivate);
        });
      }
    }
  },

};

export default isPrivateDenormalizer;
