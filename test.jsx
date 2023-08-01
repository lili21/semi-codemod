import { Tooltip,Button } from 'antd'


export const test = ()=>{
  return <div>
    <Tooltip title={'123'}>
            <a style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }} target="_blank">
             3333
            </a>
          </Tooltip>
    <Tooltip title={'345'}>
           <Button>eee</Button>
          </Tooltip>
          
  </div>
          

          
}