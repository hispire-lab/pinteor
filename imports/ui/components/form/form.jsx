import React from 'react';
import { R } from 'meteor/ramda:ramda';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.addToForm = this.addToForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);

    this.state = { isSubmitted: false, isValid: false };
  }

  componentWillMount() {
    this.fields = [];
    this.children = [];
  }

  componentDidUpdate() {
    console.log('valid: ', this.state.isValid);
  }

  addToForm(field) {
    this.fields.push({
      name: field.props.name,
      isValid: false,
      validated: false,
    });
  }
  // a fields is valid if both isValid and
  // validated props are true
  allFieldsAreValid(fields) {
    const allTrue = R.reduce(R.and, true);
    return allTrue([
      allTrue(R.pluck('validated', fields)),
      allTrue(R.pluck('isValid', fields)),
    ]);
  }

  handleUserInput(obj) {
    const field = R.find(R.propEq('name', obj.name), this.fields);
    field.isValid = obj.isValid;
    field.validated = true;

    this.setState({
      isSubmitted: false,
      isValid: this.allFieldsAreValid(this.fields),
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isSubmitted: true });
  }

  render() {
    this.children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        addToForm: this.addToForm,
        handleUserInput: this.handleUserInput,
        isSubmitted: this.state.isSubmitted,
        key: child.props.name,
      })
    );

    return (
      <form onSubmit={this.handleSubmit}>
        {this.children}
        <button type="submit">Save</button>
      </form>
    );
  }

}

export default Form;
