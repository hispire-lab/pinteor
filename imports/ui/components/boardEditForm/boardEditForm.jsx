import React from 'react';
import { _ } from 'underscore';
import { setName } from '../../../api/boards/methods.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class BoardEditForm extends React.Component {

  constructor(props) {
    super(props);

    this.handleName = this.handleName.bind(this);

    this.oldProps = {};
    this.oldProps.name = this.props.name;

    this.state = {
      errors: {},
      name: this.props.name,
    };

    this.throttledUpdateName = _.throttle((value) => {
      if (this.oldProps.name !== value) {
        setName.call({
          boardId: this.props._id,
          newName: value,
        }, err => {
          if (err) {
            this.setState({ errors: { name: err.reason } });
          } else {
            this.oldProps.name = value;
            this.setState({ errors: { name: '' } });
          }
        });
      }
    }, 300);
  }

  handleName(event) {
    const value = event.target.value.trim();
    let error;
    try {
      new SimpleSchema({
        newName: {
          type: String,
          max: 10,
        },
      }).validate({
        newName: value,
      });
    } catch (e) {
      error = e;
    } finally {
      if (error) {
        this.setState({
          errors: { name: error.reason },
          name: value,
        });
      } else {
        this.throttledUpdateName(value);
      }
    }
  }

  render() {
    return (
      <div>
        <h1>Edit a board</h1>

        <p>{this.state.errors.name}</p>
        <input
          type="text"
          name="name"
          defaultValue={this.props.name}
          onChange={this.handleName}
        />
      </div>
    );
  }

}

export default BoardEditForm;
