import React from 'react';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class FormInput extends React.Component {

  constructor(props) {
    super(props);

    this.handleInput = this.handleInput.bind(this);
    this.state = { error: '' };
  }

  handleInput(event) {
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
        this.setState({ error: error.reason });
      } else {
        this.setState({ error: '' });
      }
    }
  }

  render() {
    return (
      <div>
        <p>{this.state.error}</p>
        <input
          type="text"
          name={this.props.name}
          defaultValue={this.props.defaultValue}
          onChange={this.handleInput}
        />
      </div>
    );
  }

}

export default FormInput;
