import React from 'react';
/* eslint-disable no-unused-vars */
import Form from '../form/form.jsx';
/* eslint-enable no-unused-vars */
/* eslint-disable no-unused-vars */
import FormInput from '../formInput/formInput.jsx';
/* eslint-enable no-unused-vars */

class BoardEditForm extends React.Component {

  render() {
    const { name } = this.props;
    return (
      <div>
        <h1>Edit a board</h1>

        <Form>
          <FormInput name={name} defaultValue={name} />
        </Form>

      </div>
    );
  }

}

export default BoardEditForm;
