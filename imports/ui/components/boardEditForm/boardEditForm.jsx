import React from 'react';
import { setName } from '../../../api/boards/methods.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class BoardEditForm extends React.Component {

  constructor(props) {
    super(props);

    this.handleName = this.handleName.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      errors: {},
    };
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
    let error;
    try {
      new SimpleSchema({
        newName: {
          type: String,
          max: 10,
        },
      }).validate({
        newName: event.target.value,
      });
    } catch (e) {
      error = e;
    } finally {
      if (error) {
        this.setState({ errors: { name: error.reason } });
      } else {
        this.setState({ errors: { name: '' } });
      }
    }
  }

  handleDescription(event) {
    let error;
    try {
      new SimpleSchema({
        description: {
          type: String,
          min: 5,
        },
      }).validate({
        description: event.target.value,
      });
    } catch (e) {
      error = e;
    } finally {
      if (error) {
        this.setState({ errors: { description: error.reason } });
      } else {
        this.setState({ errors: { description: '' } });
      }
    }
  }

  render() {
    const { name, description } = this.props;

    return (
      <div>
        <h1>Edit a board</h1>

        <p>{this.state.errors.name}</p>
        <input
          type="text"
          name="name"
          defaultValue={name}
          onChange={this.handleName}
        />

      <p>{this.state.errors.description}</p>
        <input
          type="text"
          name="description"
          defaultValue={description}
          onChange={this.handleDescription}
        />

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
