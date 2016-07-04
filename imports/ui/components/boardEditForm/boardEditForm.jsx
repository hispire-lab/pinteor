import React from 'react';
/* eslint-disable no-unused-vars */
import Form from '../form/form.jsx';
/* eslint-enable no-unused-vars */
/* eslint-disable no-unused-vars */
import FormInput from '../formInput/formInput.jsx';
/* eslint-enable no-unused-vars */
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class BoardEditForm extends React.Component {

  render() {
    const { name, description } = this.props;
    return (
      <div>
        <h1>Edit a board</h1>

        <Form>
          <FormInput
            name="name"
            defaultValue={name}
            schema={new SimpleSchema({
              name: {
                type: String,
                max: 10,
              },
            })}
          />
          <FormInput
            name="description"
            defaultValue={description}
            schema={new SimpleSchema({
              description: {
                type: String,
                min: 5,
              },
            })}
          />
        </Form>

      </div>
    );
  }

}

export default BoardEditForm;
