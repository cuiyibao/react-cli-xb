import React from 'react'
import './index.less'
import { Form, Input, Button, message, Icon, Checkbox } from 'antd';
import { net } from '../../network'
import md5 from 'md5';
import { browserHistory } from 'react-router';

const layout = {
  wrapperCol: {
    span: 24,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  },
};


class LoginPage extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSubmit = () => {
    // this.form = Form.useForm()
    const { form } = this.props
    console.log('@$$', this.props.form)
    form.validateFields(['username', 'password'], (errors, values) => {
      if (!errors) {
        const username = form.getFieldValue('username') || ''
        const password = form.getFieldValue('password') || ''
        net.post('/api/login', {
          username,
          password: md5(password)
        }).then(res => {
          if (res.ec === 0) {
            message.error(res.em || '请求错误')
          }
          if (res.ec === 100) {
            // message.success(res.em)
            console.log('@$$', browserHistory)
            browserHistory.push('/')
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
      <div className='login-page'>
        <div className='form-wrp'>
          <header className='login-header-wrp'>
            <div className='l-logo' />
            <div className='l-title'>Fox Tester</div>
          </header>
          <Form className="login-form" {...layout}>
            <Form.Item className="user-wrp">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名，例如：zhangsan"
                />,
              )}
            </Form.Item>
            <Form.Item className="password-wrp">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="请输入密码"
                />,
              )}
            </Form.Item>
            <Form.Item className="remember-wrp">
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>自动登录</Checkbox>)}
              <div className="login-form-forgot">
                创建用户请@管理员
              </div>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={this.handleSubmit} className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

const EnhancedForm = Form.create()(LoginPage);


export default () => {
  return <EnhancedForm wrappedComponentRef={(form) => this.form = form} />
}