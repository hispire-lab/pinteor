import React from 'react';
/* eslint-disable no-unused-vars */
import BoardFormUpdate from '../boardFormUpdate/boardFormUpdate.jsx';
/* eslint-enable no-unused-vars */

export default class BoardPreview extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { name, pinsCount, description, doc } = this.props;

    return (
      <div>
        <h3>{name}</h3>
        <p>{pinsCount}</p>
        <p>{description}</p>

        <BoardFormUpdate doc={doc} />
      </div>
    );
  }
}
