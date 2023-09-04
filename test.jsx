import { Table } from 'antd'

export const test = () => {
  const paginationProps = { current: 1, showTotal: (t) => `${t}条` }
  return <Table pagination={paginationProps} />
}
