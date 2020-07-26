import React from 'react'
import { net } from '../../network'
import {
  List,
  Avatar,
  Button,
  Skeleton,
  message,
  Popconfirm,
  Form,
  Input,
  Modal,
  Calendar,
  Select,
  InputNumber
} from 'antd'
import './index.less'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import { addScheModal } from './components/modal'
import HomeTable from './components/table'

const Option = Select.Option

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

class remarkForm extends React.Component {
  handleOk = (id, callback) => {
    const { form } = this.props
    form.validateFields(['hours', 'comment'], (errors, values) => {
      if (!errors) {
        const hours = form.getFieldValue('hours') || ''
        const comment = form.getFieldValue('comment') || ''
        net.post('/api/task/finish', {
          task_id: id,
          hours,
          comment
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
      <Form className="remark-form" {...layout}>
        <Form.Item className="user-wrp" label='耗时'>
          {getFieldDecorator('hours', {
            rules: [
              { required: true, message: '请输入0-24小时范围' },
            ]
          })(
            <InputNumber
              placeholder="请输入0-24小时"
              style={{ width: '100%' }}
              max={24}
              min={0}
            />
          )}
        </Form.Item>
        <Form.Item className="user-wrp" label='备注'>
          {getFieldDecorator('comment', {
            rules: [{ required: true, message: '请输入备注' }],
          })(
            <Input.TextArea
              placeholder="请输入备注，不多于255个字符"
              maxLength={255}
              autoSize={{ minRows: 4, maxRows: 5 }}
            />
          )}
        </Form.Item>
      </Form>
    )
  }
}

const EnhancedForm = Form.create()(remarkForm);

const TaskList = ({ info, getTaskList, handleToggleModal }) => {
  const handleDeleteTask = id => {
    net.post('/api/task/del', {
      task_id: id
    }).then(res => {
      if (res.ec === 0) {
        message.error(res.em || '请求错误')
      }
      if (res.ec === 100) {
        getTaskList()
      }
    }).catch(err => {
      console.error('错误：', err)
      // Toast.info(err || '登录报错')
    })
  }

  const handleDeleteSchedule = id => {
    net.post('/api/schedule/del', {
      schedule_id: id
    }).then(res => {
      if (res.ec === 0) {
        message.error(res.em || '请求错误')
      }
      if (res.ec === 100) {
        getTaskList()
      }
    }).catch(err => {
      console.error('错误：', err)
      // Toast.info(err || '登录报错')
    })
  }

  return (
    <div className='module-task'>
      <div className='today-wrp'>
        <h3>今日任务</h3>
        <List
          className="task-list-wrp"
          itemLayout="horizontal"
          dataSource={info.today_undone}
          renderItem={item => (
            <List.Item
              actions={[
                <Popconfirm
                  title="是否删除?"
                  onConfirm={() => {
                    handleDeleteTask(item.task_id)
                  }}
                  // onCancel={cancel}
                  okText="是"
                  cancelText="否"
                >
                  <a href="#">删除</a>
                </Popconfirm>,
                <a key="list-loadmore-edit" onClick={() => {
                  handleToggleModal(item.task_id)
                }}>完成</a>
              ]}
            >
              {item.schedule_title}
            </List.Item>
          )}
        />
      </div>
      {info.history && info.history.length > 0 && <div className='history-wrp'>
        <h3>历史任务</h3>
        <List
          className="task-list-wrp"
          itemLayout="horizontal"
          dataSource={info.history}
          renderItem={item => (
            <List.Item
              actions={[
                <Popconfirm
                  title="是否删除?"
                  onConfirm={() => {
                    handleDeleteTask(item.task_id)
                  }}
                  // onCancel={cancel}
                  okText="是"
                  cancelText="否"
                >
                  <a href="#">删除</a>
                </Popconfirm>,
                <a key="list-loadmore-edit" onClick={() => {
                  handleToggleModal(item.task_id)
                }}>完成</a>
              ]}
            >
              {`[${item.date}] ${item.schedule_title}`}
            </List.Item>
          )}
        />
      </div>}
      {info.unfinished_schedule && info.unfinished_schedule.length > 0 && <div className='future-wrp'>
        <h3>未完成的项目</h3>
        <List
          className="task-list-wrp"
          itemLayout="horizontal"
          dataSource={info.unfinished_schedule}
          renderItem={item => (
            <List.Item
              actions={[
                <Popconfirm
                  title="是否删除?"
                  onConfirm={() => {
                    handleDeleteSchedule(item.schedule_id)
                  }}
                  // onCancel={cancel}
                  okText="是"
                  cancelText="否"
                >
                  <a href="#">删除</a>
                </Popconfirm>,
                <a key="list-loadmore-edit" onClick={addScheModal.bind(this, { scheId: item.schedule_id })}>编辑</a>
              ]}
            >
              {item.schedule_title}
            </List.Item>
          )}
        />
      </div>}
    </div>
  )
}

export default class HomePage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      taskList: {},
      isVisible: false,
      selectDate: [],
      userList: [],
      currentUser: '',
      userInfo: {},
      scheDateList: {},
      currentDate: moment()
    }

    this.form = null
  }

  componentDidMount() {
    this.getTaskList()
    // this.getUserList()
    this.getCurrentUser()
    this.getScheDateList()
  }

  getTaskList = () => {
    net.get('/api/task/list').then(res => {
      if (res.ec === 100) {
        this.setState({
          taskList: res.data
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

  getCurrentUser = () => {
    net.get('/api/user_info').then(res => {
      if (res.ec === 100) {
        this.setState({
          userInfo: res.data,
          currentUser: res.data.id
        })
      }
    }).catch(err => {
      console.error('错误：', err)
    })
  }

  getScheDateList = () => {
    net.post('/api/sche/index', {
      date: '2020-05-01'
    }).then(res => {
      if (res.ec === 100) {
        let { scheDateList } = this.state
        res.data && res.data.forEach((ele, ind) => {
          ele['sche_dates'] && ele['sche_dates'].forEach(date => {
            if (scheDateList[date] && scheDateList[date]['titleList'].length < 3) {
              scheDateList[date]['titleList'].push(ele.title)
            } else {
              scheDateList[date] = {
                titleList: [ele.title]
              }
            }
          })
        })
        this.setState({
          scheDateList,
          currentDate: moment('2020-05-01')
        })
      }
    }).catch(err => {
      console.error('错误：', err)
    })
  }

  handleToggleModal = visible => {
    this.setState({
      isVisible: visible || !this.state.isVisible
    })
  }

  dateCellRender = date => {
    const { selectDate, scheDateList } = this.state
    const _date = moment(date).format('YYYY-MM-DD')
    console.log('日历渲染', scheDateList)
    if (selectDate.indexOf(_date) > -1) {
      return (
        <h5>选中</h5>
      )
    } else if (scheDateList[_date]) {
      return (
        <ul>
          {scheDateList[_date] && scheDateList[_date]['titleList'] && scheDateList[_date]['titleList'].map(ele => <li>{ele}</li>)}
        </ul>
      )
    }
  }

  handleDateSelect = date => {
    const { selectDate } = this.state
    console.log('@@#$', selectDate)
    const _date = moment(date).format('YYYY-MM-DD')
    if (selectDate.indexOf(_date) === -1) {
      selectDate.push(_date)
    } else if (selectDate.indexOf(_date) > -1) {
      selectDate.splice(selectDate.indexOf(_date), 1)
    }
    this.setState({
      selectDate
    })
  }

  render() {
    const { taskList, selectDate, userList, currentUser, currentDate } = this.state
    return (
      <div className='home-page'>
        <div className='home-left-wrp'>
          <header className='home-header-wrp'>
            <Button
              className='header-add-btn'
              type='primary'
              // disabled={selectDate.length > 0 ? false : true}
              onClick={addScheModal.bind(this, { userId: currentUser })}
            >
              创建排期
            </Button>
          </header>
          <section className='main-wrapper'>
            <HomeTable />
          </section>
          {/* <Calendar
            locale={zhCN}
            value={currentDate}
            dateCellRender={this.dateCellRender}
            onSelect={this.handleDateSelect}
          /> */}
        </div>
        <div className='home-right-wrp'>
          <TaskList info={taskList} getTaskList={this.getTaskList} handleToggleModal={this.handleToggleModal} />
        </div>

        <Modal
          title="完成任务"
          visible={!!this.state.isVisible}
          okText="确定"
          onOk={() => {
            this.form && this.form.handleOk && this.form.handleOk(this.state.isVisible, () => {
              this.handleToggleModal(false)
              this.getTaskList()
            })
          }}
          cancelText="取消"
          onCancel={this.handleToggleModal.bind(this, false)}
        >
          <EnhancedForm wrappedComponentRef={(form) => this.form = form} />
        </Modal>
      </div>
    )
  }
}