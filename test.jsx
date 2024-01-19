import { Alert, Tooltip, Card } from 'antd'

export const test = () => {
  return (
    <>
      <Alert banner message="快照内容" type="error" closable />
      <Tooltip placement="bottom">test</Tooltip>
      <Card hoverable extra={<div>11111</div>}>
        test card
      </Card>
    </>
  )
}
