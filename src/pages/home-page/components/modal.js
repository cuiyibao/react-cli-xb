import React, { Component } from "react"
import ReactDOM from "react-dom"
import { ExtAddScheForm } from './form'
import { LocaleProvider, Modal } from "antd"
import zhCN from "antd/lib/locale-provider/zh_CN"

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


export const addScheModal = ({ userId, scheId }) => {
  modalFuncCall(destroy => {
    return (
      <Modal
        title={scheId ? '编辑排期' : '创建排期'}
        visible={true}
        okText="确定"
        onOk={() => {
          this.form && this.form.handleOk && this.form.handleOk(destroy)
        }}
        cancelText="取消"
        onCancel={destroy}
      >
        <ExtAddScheForm currentUser={userId} scheId={scheId} wrappedComponentRef={(form) => this.form = form} />
      </Modal>
    )
  })
}