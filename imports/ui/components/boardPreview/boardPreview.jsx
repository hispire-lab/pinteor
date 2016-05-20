import React from 'react';

class BoardPreview extends React.Component {
  constructor(props) {
    super(props);
    this.editBoard = this.editBoard.bind(this);
  }
  editBoard(e) {}
  render() {
    const { name, pinsCount, description } = this.props;
    return (
      <div>
        <h3>{name}</h3>
        <p>{pinsCount}</p>
        <p>{description}</p>
        <button
          type="button"
          onClick={this.editBoard}
        >
          Edit
        </button>
      </div>
    );
  }
}

export default BoardPreview;
