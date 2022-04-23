import { getPath } from '@/api'
import { EditOutlined, EyeOutlined, FileAddOutlined, MoreOutlined, RedoOutlined, UpOutlined } from '@ant-design/icons'
import { Dropdown, Menu, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import './index.less'

export default function index() {
  const [paths, setPath] = useState<string[]>([])
  useEffect(() => {
    getPath().then((path) => {
      setPath(path)
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
        {paths.map((key, index) => {
          return index + 1 === paths.length ? (
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
    </div>
  )
}
