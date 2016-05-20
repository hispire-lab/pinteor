import React from 'react';
/* eslint-disable no-unused-vars */
import BoardPreview from '../components/boardPreview/boardPreview.jsx';
/* eslint-enable no-unused-vars */

class UserPage extends React.Component {
  render() {
    const { user, userExists, boards, loading } = this.props;
    if (loading) {
      return (<div>loading...</div>);
    } else if (!userExists) {
      return (<div>Not found</div>);
    }
    /* NOTE: warning.js:44 Warning: Each child in an array or iterator should have a
     * unique "key" prop. Check the render method of `UserPage`.
     * See https://fb.me/react-warning-keys for more information.
     */
    const Boards = boards.map(board => (
      <BoardPreview
        key={board._id}
        name={board.name}
        pinsCount={board.pinsCount}
        description={board.description}
      />
    ));

    return (
      <div>
        <h1>User Page</h1>
        <p>user name: {user.username}</p>
        <p>user likes count: {user.likesCount}</p>
        {Boards}
      </div>
    );
  }
}

export default UserPage;
