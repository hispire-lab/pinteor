import React from 'react';
import { setName } from '../../../api/boards/methods.js';

class BoardEditForm extends React.Component {

  constructor(props) {
    super(props);

    this.handleName = this.handleName.bind(this);
    this.save = this.save.bind(this);
  }

  delete() {}

  cancel() {}

  save() {
    setName.call({
      boardId: this.props._id,
      newName: this.state.name,
    });
  }

  handleName(event) {
    this.setState({ name: event.target.value });
  }

  render() {
    const { name, description } = this.props;

    return (
      <div>
        <h1>Edit a board</h1>
        <input
          type="text"
          name="name"
          defaultValue={name}
          onChange={this.handleName}
        />
        <input type="text" name="description" defaultValue={description} />

        <button type="button" onClick={this.delete}>
          Delete
        </button>
        <button type="button" onClick={this.cancel}>
          Cancel
        </button>
        <button type="button" onClick={this.save}>
          Save
        </button>
      </div>
    );
  }

}

export default BoardEditForm;
