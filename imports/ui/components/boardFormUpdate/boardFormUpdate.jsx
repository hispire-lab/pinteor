import React from 'react';
/* eslint-disable no-unused-vars */
import Modal from 'react-modal';
/* eslint-enable no-unused-vars */
/* eslint-disable no-unused-vars */
import Blaze from 'meteor/gadicc:blaze-react-component';
/* eslint-enable no-unused-vars */
import { Boards } from '../../../api/boards/boards.js';
import './boardFormUpdate.html';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default class BoardFormUpdate extends React.Component {

  constructor(props) {
    super(props);

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = { modalIsOpen: false };
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.refs.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { doc } = this.props;
    return (
      <div>
        <button onClick={this.openModal}>Update</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
         >
           <Blaze
             template="boardFormUpdate"
             collection={Boards}
             doc={doc}
             modal={this}
           />
           <button onClick={this.closeModal}>Close</button>
        </Modal>
      </div>
    );
  }

}
