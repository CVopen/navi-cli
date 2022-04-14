import { ContainerOutlined } from '@ant-design/icons'
import { Card, Button } from 'antd'
import React, { memo } from 'react'

import { useAppSelector } from '@/store'
import { ProjectItem } from '.'

const Task = ({ active }: { active: ProjectItem }) => {
  const socket = useAppSelector((store) => store.app.socket)

  const start = () => {
    socket?.send(JSON.stringify({ type: 'start', data: active.local }))
  }

  return (
    <Card
      title={
        <div className="info-title">
          <ContainerOutlined className="icon" />
          任务
          <Button type="primary">打包</Button>
          <Button type="primary" style={{ marginRight: 10 }} onClick={start}>
            启动
          </Button>
        </div>
      }
      bordered={false}
    >
      内容
    </Card>
  )
}

export default memo(Task)
