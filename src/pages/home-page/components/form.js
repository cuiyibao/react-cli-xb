import React from 'react'
import ReactDOM from "react-dom"
import {
  Form,
  Input,
  Radio,
  Select,
  Calendar,
  message
} from 'antd'
import { net } from '../../../network'
import moment from 'moment'
import './form.less'
import zhCN from 'antd/es/locale/zh_CN'

const layout = {
  labelCol: {
    offset: 1,
    span: 3
  },
  wrapperCol: {
    offset: 1,
    span: 17,
  },
}

class addScheForm extends React.Component {
  state = {
    userList: [],
    selectDate: [],
    scheInfo: {}
  }

  componentDidMount() {
    this.props.scheId && this.getScheInfo()
    this.getUserList()
  }

  getUserList = () => {
    net.get('/api/get_users').then(res => {
      console.log('用户信息列表：', res)
      if (res.ec === 100) {
        this.setState({
          userList: res.data
        })
      }
      if (res.ec === 0) {
        message.error(res.em || '请求错误')
      }
    }).catch(err => {
      console.error('错误：', err)
      // Toast.info(err || '登录报错')
    })
  }

  getScheInfo = () => {
    net.post('/api/schedule/info', {
      schedule_id: this.props.scheId
    }).then(res => {
      console.log('排期详情：', res)
      if (res.ec === 100) {
        this.setState({
          scheInfo: res.data,
          selectDate: res.data.dates
        })
      }
      if (res.ec === 0) {
        message.error(res.em || '请求错误')
      }
    }).catch(err => {
      console.error('错误：', err)
      // Toast.info(err || '登录报错')
    })
  }

  handleOk = (callback) => {
    const { form, scheId } = this.props
    const { selectDate } = this.state
    console.log('@$$', form)
    form.validateFields(['title', 'type', 'users', 'dates'], (errors, values) => {
      if (!errors) {
        const title = form.getFieldValue('title') || ''
        const type = form.getFieldValue('type') || ''
        const users = form.getFieldValue('users') || ''
        let params = { id: scheId }
        net.post(scheId ? '/api/schedule/edit' : '/api/schedule/create', {
          title,
          type,
          users: users,
          dates: selectDate,
          ...params
        }).then(res => {
          console.log('&^^^^:', res)
          if (res.ec === 0) {
            message.error(res.em || '请求错误')
          }
          if (res.ec === 100) {
            message.success(res.em)
            callback && callback()
            setTimeout(() =>{
              window.location.reload()
            }, 1000)
          }
        }).catch(err => {
          console.error('错误：', err)
          // Toast.info(err || '登录报错')
        })
      }
    })
  }

  dateCellRender = date => {
    const { selectDate } = this.state
    console.log('@####', selectDate)
    const _date = moment(date).format('YYYY-MM-DD')
    if (selectDate && selectDate.indexOf(_date) > -1) {
      return (
        <div className='date-border' />
      )
    }
  }

  handleDateSelect = date => {
    const { selectDate } = this.state
    const _date = moment(date).format('YYYY-MM-DD')
    if (selectDate.indexOf(_date) === -1) {
      selectDate.push(_date)
    } else if (selectDate.indexOf(_date) > -1) {
      selectDate.splice(selectDate.indexOf(_date), 1)
    }
    console.log('@####', selectDate)
    this.setState({
      selectDate
    })
  }

  render() {
    const { userList, scheInfo } = this.state
    const { getFieldDecorator } = this.props.form
    const { currentUser } = this.props
    console.log('&&&&', scheInfo)
    return (
      <Form className="create-scheule-form" {...layout}>
        <Form.Item className="user-wrp" label='项目'>
          {getFieldDecorator('title', {
            initialValue: scheInfo.title || '',
            rules: [{ required: true, message: '项目' }]
          })(
            <Input
              placeholder="请输入项目"
            />
          )}
        </Form.Item>
        <Form.Item className="user-wrp" label='类型'>
          {getFieldDecorator('type', {
            initialValue: scheInfo.type || "1",
            rules: [{ required: true, message: '类型' }],
          })(
            <Radio.Group>
              <Radio.Button value="1">测试</Radio.Button>
              <Radio.Button value="2">其他</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item className="user-wrp" label='人力'>
          {getFieldDecorator('users', {
            initialValue: scheInfo.users ? scheInfo.users : [currentUser],
            rules: [{ required: true, message: '人力' }],
          })(
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择人力"
            >
              {userList && userList.map((e, i) => <Select.Option value={e.uid}>{e.nickname}</Select.Option>)}
            </Select>
          )}
        </Form.Item>
        <Form.Item className="user-wrp" label='排期'>
          {getFieldDecorator('dates', {
            initialValue: moment(),
            rules: [{ required: true, message: '排期' }],
          })(
            <Calendar 
              fullscreen={false}
              locale={zhCN}
              dateCellRender={this.dateCellRender}
              onSelect={this.handleDateSelect}
            />
          )}
        </Form.Item>
        {/* <Form.Item className="user-wrp" label='备注'>
          {getFieldDecorator('comment', {
            rules: [{ required: true, message: '请输入备注' }],
          })(
            <Input.TextArea
              placeholder="请输入备注，不多于255个字符"
              maxLength={255}
              autoSize={{ minRows: 4, maxRows: 5 }}
            />
          )}
        </Form.Item> */}
      </Form>
    )
  }
}

export const ExtAddScheForm = Form.create()(addScheForm);