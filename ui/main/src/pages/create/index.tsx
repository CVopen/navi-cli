import { getPath } from '@/api'
import {
  EditOutlined,
  EyeOutlined,
  FileAddOutlined,
  FolderFilled,
  FolderOutlined,
  MoreOutlined,
  PlusOutlined,
  RedoOutlined,
  UpOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Menu, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import './index.less'

import reactLogo from '@/assets/react.svg'
import vueLogo from '@/assets/vue.svg'

interface PathLocal {
  path: string[]
  folderList: { folderName: string; frame: '' | 'vue' | 'react' }[]
}

export default function index() {
  const [pathLocal, setPathLocal] = useState<PathLocal>({ path: [], folderList: [] })
  useEffect(() => {
    // getPath({ path: '/Users/open/Desktop/navi-cli/commands/ui' }).then((res) => {
    getPath().then((res) => {
      setPathLocal(res as unknown as PathLocal)
    })
  }, [])

  const menu = (
    <Menu style={{ backgroundColor: '#00141b' }}>
      <Menu.Item key="1" style={{ backgroundColor: '#00141b' }}>
        <FileAddOutlined style={{ marginRight: 5 }} />
        新建文件夹
      </Menu.Item>
      <Menu.Item key="2" style={{ backgroundColor: '#00141b' }}>
        <EyeOutlined style={{ marginRight: 5 }} />
        显示隐藏文件夹
        <Switch
          defaultChecked
          onChange={(checked) => {
            console.log(`switch to ${checked}`)
          }}
          style={{ marginLeft: 5 }}
        />
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="admin-create">
      <div className="create-header">
        <div className="create-header-item">
          <UpOutlined />
        </div>
        {pathLocal.path.map((key, index) => {
          return index + 1 === pathLocal.path.length ? (
            <div className="create-header-item" key={key} style={{ flex: 1 }}>
              <span>{key}</span>
              <EditOutlined style={{ float: 'right', marginTop: 5 }} />
            </div>
          ) : (
            <div className="create-header-item" key={key || '/'}>
              <span>{key || '/'}</span>
            </div>
          )
        })}
        <div className="create-header-item">
          <RedoOutlined />
        </div>
        <div className="create-header-item">
          <Dropdown overlay={menu} placement="bottomRight">
            <MoreOutlined />
          </Dropdown>
        </div>
      </div>
      <div className="create-folder">
        {pathLocal.folderList.map(({ folderName, frame }) => (
          <div key={folderName}>
            {frame ? <FolderFilled /> : <FolderOutlined />}
            {folderName}
            {frame === 'vue' && <img src={vueLogo} alt="" />}
            {frame === 'react' && <img src={reactLogo} alt="" />}
          </div>
        ))}
      </div>
      <div className="create-btn">
        <Button type="primary" icon={<PlusOutlined />}>
          在此处创建新项目
        </Button>
      </div>
    </div>
  )
}
