import { Button, notification, Table } from 'antd'

import { Divider } from '@douyinfe/semi-ui'

function Test() {
  return (
    <Table
      rowKey="search_query"
      rowSelection={rowSelection}
      columns={this.columns}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      size="small"
    />
  )
}
