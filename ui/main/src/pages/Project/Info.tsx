import { openFolder } from '@/api/project'
import { BankOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import React, { memo } from 'react'
import { ProjectItem } from '.'

const Info = memo(({ active }: { active: ProjectItem }) => {
  const open = () => {
    openFolder({ local: active?.local as string })
  }

  return (
    <Card
      title={
        <div className="info-title">
          <BankOutlined className="icon" />
          项目信息
          <Button type="primary" icon={<FolderOpenOutlined />} onClick={open}>
            打开文件夹
          </Button>
        </div>
      }
      bordered={false}
    >
      <p>
        <span>项目名称: </span>
        {active?.name}
      </p>
      <p>
        <span>创建时间: </span>
        {active?.createTime}
      </p>
      <p>
        <span>项目路径: </span>
        {active?.local}
      </p>
    </Card>
  )
})

export default Info
