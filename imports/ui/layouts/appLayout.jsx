import React from 'react';

class AppLayout extends React.Component {
  render() {
    return (
      <div id="container">{ this.props.main() }</div>
    );
  }
}

export default AppLayout;
