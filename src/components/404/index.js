/**
 * 404: 错误页
 */

import React, { Component } from 'react'
import './index.less'

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }


  componentDidMount() {
  }

  render() {
    return (
      <div className="error-wrap">
        <center>所请求内容在光年以外</center>
      </div>
    )
  }
}
