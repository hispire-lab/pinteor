var pinMoveFormHooks = {

  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    Pins.update(currentDoc._id, {
      $set: {boardId: insertDoc.boardId }
    })
    this.done();
    return false
  }

}
AutoForm.hooks({
  'pin_move_form': pinMoveFormHooks
});
