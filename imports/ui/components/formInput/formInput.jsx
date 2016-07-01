import React from 'react';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class FormInput extends React.Component {

  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: this.props.defaultValue,
      isValid: true,
      error: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSubmitted) {
      const obj = this.validate();
      this.props.handleUserInput({
        isValid: obj.isValid,
        error: obj.error,
      });
      this.setState({
        isValid: obj.isValid,
        error: obj.error,
      });
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  validate() {
    let obj = {};
    let error;
    try {
      new SimpleSchema({
        newName: {
          type: String,
          max: 10,
        },
      }).validate({
        newName: this.state.value,
      });
    } catch (e) {
      error = e;
    } finally {
      if (error) {
        obj = {
          isValid: false,
          error: error.reason,
        };
      } else {
        obj = {
          isValid: true,
          error: '',
        };
      }
    }
    return obj;
  }

  render() {
    return (
      <div>
        <p>{this.state.error}</p>
        <input
          type="text"
          name={this.props.name}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }

}

export default FormInput;
