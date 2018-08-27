/**
 * nav: 导航栏
 */

import React, { Component } from 'react'
import { Menu } from 'antd';
import { Link, browserHistory } from 'react-router';

import { menuConfig as navList } from '../../config/menu-config' 

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  getNavList(navList = []){
    if(navList.length === 0){ return }
    let menuList = []
    navList.forEach((item, index) => {
      if(item.children && item.children.length){
        menuList.push(
          <Menu.SubMenu key={item.url} title={item.title}>
              {this.getNavList(item.children)}
          </Menu.SubMenu>
        )
      }else {
        menuList.push(
          <Menu.Item key={item.url}>
              <Link to={item.url}><span>{item.title}</span></Link>
          </Menu.Item>
        )
      }
    })
    return menuList;
  }

  componentDidMount() {
  }

  render() {
    const NavList = this.getNavList(navList)
    const pathname = browserHistory.getCurrentLocation().pathname
    let openKey = pathname.indexOf('/', 1)
    openKey > -1 ? openKey = pathname.substring(0, openKey) : openKey = ''
    return (
      <div className="nav-wrap">
        <div style={{ width: '100%' , 'backgroundColor': 'transparent' }}>
          <Menu
            defaultSelectedKeys={[pathname]}
            defaultOpenKeys= {[openKey]}
            mode="inline"
          >
            {NavList}
          </Menu>
        </div>
      </div>
    )
  }
}
