import React from 'react';
// import { R } from 'meteor/ramda:ramda';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);

    this.state = { isSubmitted: false };
  }

  handleUserInput(obj) {
    console.log(obj.isValid, obj.error);
    this.setState({ isSubmitted: false });
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
