import React from 'react';

class UserPage extends React.Component {
  render() {
    const { user, userExists } = this.props;
    if (!userExists) {
      return (<div>Not found</div>);
    }
    return (
      <div>
        <h1>User Page</h1>
        <p>user name: {user.username}</p>
      <p>user likes count: {user.likesCount}</p>
      </div>
    );
  }
}

export default UserPage;
