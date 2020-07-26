import React, { Component } from "react"
import ReactDOM from "react-dom"
import { ExtAddScheForm } from './form'
import { LocaleProvider, Modal } from "antd"
import zhCN from "antd/lib/locale-provider/zh_CN"
import { net } from '../../../network'
import './detailModal.less'

/**
 * 模态框函数式调用
 * @param {Function} modal 模特框组件
 */
export const modalFuncCall = modal => {
  const _wrap = document.createElement('div')
  document.body.appendChild(_wrap)
  ReactDOM.render(
    <LocaleProvider locale={zhCN}>
      {modal(() => {
        const unmountResult = ReactDOM.unmountComponentAtNode(_wrap)
        if (unmountResult && _wrap.parentNode) {
          _wrap.parentNode.removeChild(_wrap)
        }
      })}
    </LocaleProvider>,
    _wrap
  )
}


export const detailModal = ({ uid, date }) => {
  net.post('/api/today_task/list', {
    uid,
    date
  }).then(res => {
    console.log('%%%%；', res)
    if (res.ec === 100) {
      modalFuncCall(destroy => {
        return (
          <Modal
            title={'详情'}
            visible={true}
            className='detail-modal-form'
            okText="确定"
            onOk={destroy}
            cancelText="取消"
            footer={null}
            onCancel={destroy}
          >
            <ul>
              {res.data && res.data.map((item, index) => (
                <li>
                  <p>
                    <span>{item.title}</span>
                    {item.hours ? <span>耗时{item.hours}小时</span> : ''}
                  </p>
                  <p>
                    <span>{item.finished_time ? item.comment : '未完成'}</span>
                    {item.finished_time && <span>{item.finished_time}</span>}
                  </p>
                </li>
              ))}
            </ul>
          </Modal>
        )
      })
    }
  }).catch(err => {
    console.error('错误：', err)
  })
}