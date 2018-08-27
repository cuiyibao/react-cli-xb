import React, { Component } from 'react';
import './base.less';
import Header from './header';
import Nav from './nav';
import Main from './main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header></Header>
        <Nav></Nav>
        <Main content={this.props.children}></Main>
      </div>
    );
  }
}

export default App;
