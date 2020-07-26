import React, { Component } from 'react';
import './base.less';
import Header from './header';
import Nav from './nav';
import Main from './main';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment'
import 'moment/locale/zh-cn'

class App extends Component {
  componentDidMount() {
    moment.locale('zh-cn')
  }

  render() {
    console.log('@@#$$', this.props)
    return (
      <ConfigProvider locale={zhCN}>
        <div className="App">
          <Header></Header>
          <Nav></Nav>
          <Main content={this.props.children}></Main>
        </div>
      </ConfigProvider>
    );
  }
}

export default App;
