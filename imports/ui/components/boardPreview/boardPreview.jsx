import React from 'react';
/* eslint-disable no-unused-vars */
import BoardEditForm from '../boardEditForm/boardEditForm.jsx';
/* eslint-enable no-unused-vars */

class BoardPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditBoardForm: false,
    };

    this.toggleEditBoardForm = this.toggleEditBoardForm.bind(this);
  }
  // display and hides board edit form
  toggleEditBoardForm() {
    this.setState({
      showEditBoardForm: !this.state.showEditBoardForm,
    });
  }

  render() {
    const { name, pinsCount, description } = this.props;
    return (
      <div>
        <h3>{name}</h3>
        <p>{pinsCount}</p>
        <p>{description}</p>
        <button
          type="button"
          onClick={this.toggleEditBoardForm}
        >
          Edit
        </button>

        {this.state.showEditBoardForm ? <BoardEditForm {...this.props} /> : null}
      </div>
    );
  }
}

export default BoardPreview;
