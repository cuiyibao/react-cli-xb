/**
 * header: 头部
 */

import React, { Component } from 'react'
import { Button, message, Menu, Dropdown, Icon, Modal, Form, Input, Checkbox } from 'antd';
import { browserHistory } from 'react-router'
import { net } from '../../network'
import md5 from 'md5'

const layout = {
  labelCol: {
    offset: 1,
    span: 4
  },
  wrapperCol: {
    offset: 1,
    span: 16,
  },
};

class codeForm extends React.Component {
  handleOk = callback => {
    const { form } = this.props
    console.log('@$$', form)
    form.validateFields(['old_pwd', 'new_pwd', 'confirm_pwd'], (errors, values) => {
      if (!errors) {
        const old_pwd = form.getFieldValue('old_pwd') || ''
        const new_pwd = form.getFieldValue('new_pwd') || ''
        const confirm_pwd = form.getFieldValue('confirm_pwd') || ''
        net.post('/api/modify_password', {
          old_pwd: md5(old_pwd),
          new_pwd: md5(new_pwd),
          confirm_pwd: md5(confirm_pwd)
        }).then(res => {
          if (res.ec === 0) {
            message.error(res.em || '请求错误')
          }
          if (res.ec === 100) {
            message.success(res.em)
            callback && callback()
          }
        }).catch(err => {
          console.error('错误：', err)
          // Toast.info(err || '登录报错')
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form className="code-form" {...layout}>
        <Form.Item className="user-wrp" label='旧密码'>
          {getFieldDecorator('old_pwd', {
            rules: [{ required: true, message: '请输入旧密码' }],
          })(
            <Input
              type="password"
              placeholder="请输入旧密码"
              minLength={6}
            />,
          )}
        </Form.Item>
        <Form.Item className="password-wrp" label='新密码'>
          {getFieldDecorator('new_pwd', {
            rules: [{ required: true, message: '请输入新密码' }],
          })(
            <Input
              type="password"
              placeholder="新密码，长度不少于6位"
              minLength={6}
            />,
          )}
        </Form.Item>
        <Form.Item className="password-wrp" label='确认密码'>
          {getFieldDecorator('confirm_pwd', {
            rules: [{ required: true, message: '请输入确认密码' }],
          })(
            <Input
              type="password"
              placeholder="再次输入新密码，保持一致"
              minLength={6}
            />,
          )}
        </Form.Item>
      </Form>
    )
  }
}

const EnhancedForm = Form.create()(codeForm);

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isVisible: false,
      userInfo: {}
    }

    this.form = null
  }

  componentDidMount() {
    net.get('/api/user_info').then(res => {
      if (res.ec === 100) {
        this.setState({
          userInfo: res.data
        })
      }
    }).catch(err => {
      console.error('错误：', err)
    })
  }

  handleLogout = () => {
    net.post('/api/logout').then(res => {
      if (res.ec === 0) {
        message.error(res.em || '请求错误')
      }
      if (res.ec === 100) {
        message.success(res.em)
        console.log('@$$', browserHistory)
        browserHistory.push('/login')
      }
    }).catch(err => {
      console.error('错误：', err)
      // Toast.info(err || '登录报错')
    })
  }

  renderMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={this.handleToggleModal}>
            修改密码
      </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={this.handleLogout}>
            登出
          </a>
        </Menu.Item>
      </Menu>
    )
  }

  handleToggleModal = () => {
    this.setState({
      isVisible: !this.state.isVisible
    })
  }

  render() {
    const { userInfo } = this.state
    return (
      <div className="header-wrap">
        <div className="header-left-wrp">
          <div className="he-logo" />
          <div className="he-title">Fox Tester</div>
        </div>
        <div className="header-right-wrp">
          <Dropdown overlay={this.renderMenu()} trigger={['click']} placement="bottomCenter">
            <div className="user-wrp" onClick={e => e.preventDefault()}>
              <Icon type="user" />
              <div className="user-name">{userInfo.nickname}</div>
            </div>
          </Dropdown>
          {/* <div className="logout-btn" onClick={this.handleLogout}>退出</div> */}
        </div>

        <Modal
          title="修改密码"
          visible={this.state.isVisible}
          okText="确定"
          onOk={() => {
            this.form && this.form.handleOk && this.form.handleOk(() => {
              this.handleToggleModal()
            })
          }}
          cancelText="取消"
          onCancel={this.handleToggleModal}
        >
          <EnhancedForm wrappedComponentRef={(form) => this.form = form} />
        </Modal>
      </div>
    )
  }
}
