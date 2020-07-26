import React from 'react'
import { Table, DatePicker } from 'antd'
import moment from 'moment'
import { net } from '../../../network'
import { detailModal } from './detailModal'

export default class HomeTable extends React.Component {
  state = {
    columns: [
      {
        title: '人员',
        dataIndex: 'name',
        fixed: 'left',
        width: 120
      }
    ],
    dataSource: [],
    currentDate: moment().format('YYYY-MM'),
    scheduleDate: []
  }

  componentDidMount() {
    this.getScheduleList()
  }

  getScheduleList = () => {
    const { currentDate } = this.state
    net.post('/api/schedule/index', {
      date: `${currentDate}-01`
    }).then(res => {
      console.log('%%%%；', res)
      if (res.ec === 100) {
        this.setState({
          scheduleDate: res.data
        }, () => {
          this.renderCalcDates()
        })
      }
    }).catch(err => {
      console.error('错误：', err)
    })
  }

  renderCalcDates = () => {
    let { columns, dataSource, scheduleDate, currentDate } = this.state
    columns = [
      {
        title: '人员',
        dataIndex: 'name',
        fixed: 'left',
        width: 120
      }
    ]
    dataSource = []
    scheduleDate.forEach(item => {
      dataSource.push({
        'uid': item.uid,
        'name': item.name,
        'hasWork': item.dates
      })
    })
    let m = moment(currentDate)
    let yM = m.format('YYYY-MM')
    let mEnd = parseInt(m.endOf('month').date(), 10)
    for (let i = 0; i < mEnd; i++) {
      let day = i < 9 ? `0${i + 1}` : (i + 1)
      columns.push({
        title: `${day}`,
        dataIndex: `${yM}-${day}`,
        width: 60,
        render: function (text, record, index) {
          return (
            <div 
              onClick={detailModal.bind(this, {
                uid: record.uid,
                date: `${yM}-${day}`
              })}
            >
              {text}
            </div>
          )
        }
      })
      dataSource = dataSource.map(e => {
        if (e.hasWork) {
          e[`${yM}-${day}`] = e.hasWork[`${yM}-${day}`]
        }
        return e
      })
    }
    this.setState({
      columns,
      dataSource
    })
  }

  handleDateSelect = (date, dateString) => {
    this.setState({
      currentDate: moment(date).format('YYYY-MM')
    }, () => {
      this.getScheduleList()
    })
  }

  render() {
    const { columns, dataSource, currentDate } = this.state

    const { MonthPicker } = DatePicker
    const monthFormat = 'YYYY/MM'

    return (
      <div>
        <section>
          <MonthPicker format={monthFormat} defaultValue={moment(currentDate)} onChange={this.handleDateSelect} />
        </section>
        <Table dataSource={dataSource} columns={columns} scroll={{ x: 1500, y: 300 }} />
      </div>
    )
  }
}