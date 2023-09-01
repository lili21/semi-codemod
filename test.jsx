import { Modal, Table, message, notification, Button } from 'antd'

export const test = () => {
  const fn = () => {
    Modal.success({
      content: 'some messages...some messages...',
      title: '拉取数据',
      afterClose: true,
      autoFocusButton: false,
      closeIcon: <icon></icon>
    })
    Modal.info({
      content: 'some messages...some messages...',
      title: '拉取数据',
      afterClose: true,
      autoFocusButton: false,
      closeIcon: <icon></icon>
    })
  }

  return (
    <div>
      <Modal
        title="Modal 1000px width"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        destroyOnClose={true}
        focusTriggerAfterClose={false}
        forceRender={true}
        getContainer={() => {}}
        height={100}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </div>
  )
}
