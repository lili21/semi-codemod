import { Button } from 'antd'

import { Divider, Tabs, TabPane } from '@douyinfe/semi-ui'
// const { TabPane } = Tabs

function Test() {
  return (
    <Tabs>
      <TabPane tab="项目 1" itemKey="item-1">
        内容 1
      </TabPane>
      <TabPane tab="项目 2" itemKey="item-2">
        内容 2
      </TabPane>
    </Tabs>
  )
}
