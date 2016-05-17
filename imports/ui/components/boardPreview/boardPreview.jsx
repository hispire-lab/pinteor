import React from 'react';

class BoardPreview extends React.Component {
  render() {
    const { name, pinsCount, description } = this.props;
    return (
      <div>
        <h3>{name}</h3>
        <p>{pinsCount}</p>
        <p>{description}</p>
        <button type="button">Edit</button>
      </div>
    );
  }
}

export default BoardPreview;
