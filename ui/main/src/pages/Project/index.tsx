import { getProjectList, openFolder } from '@/api/project'
import Menu from '@/components/Menu'
import { FolderOpenOutlined } from '@ant-design/icons'
import { Button, Card, Tooltip } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import './index.less'

export type Visible = 0 | 1 | 2

interface ProjectItem {
  name: string
  createTime: string
  installCommand: string
  startCommand: string
  local: string
}

export default function index() {
  const [list, setList] = useState<ProjectItem[]>([])
  const [active, setActive] = useState<ProjectItem>()
  const [isModalVisible, setIsModalVisible] = useState<Visible>(0)

  useEffect(() => {
    getList()
  }, [])

  const handleClick = useCallback((index: number) => () => setActive(list[index]), [list])

  const getList = () => {
    getProjectList().then((res) => {
      const list = res as unknown as ProjectItem[]
      setList(list)
      if (list.length) setActive(list[0])
    })
  }

  const open = () => {
    openFolder({ local: active?.local as string }).then((res) => {
      console.log(res)
    })
  }

  return (
    <div className="admin-project">
      <Menu list={list} click={handleClick} active={active} isKey={'local' as never} />
      <div className="project-content">
        <div className="info">
          <Card
            title={
              <div className="info-title">
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
        </div>
      </div>
    </div>
  )
}
