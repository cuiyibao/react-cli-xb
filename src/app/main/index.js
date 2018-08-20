/**
 * main: 内容
 */

import React, { Component } from 'react'
import { Menu, Dropdown, Icon } from 'antd'


export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }


  componentDidMount() {
  }

  render() {
    const { content } = this.props

    return (
      <div className="main-wrap">
        {content}
      </div>
    )
  }
}
