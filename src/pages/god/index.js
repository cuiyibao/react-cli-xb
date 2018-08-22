/**
 * god: 商品
 */

import React, { Component } from 'react'

import { getGodList } from './network'

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      god: []
    }
  }


  componentWillMount() {
    getGodList().then((data) => {
      this.setState({god: data.data})
    })
  }

  render() {
    const { god } = this.state
    const listItem = god.map((item, index) => 
      <li key={index}>
        <span>{item.area}</span>
        <span>{item.birthday}</span>
      </li>
    )
    return (
      <div className="god-wrap">
        <ul>{listItem}</ul>
      </div>
    )
  }
}
