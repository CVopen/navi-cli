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
import React, { useEffect, useMemo, useState } from 'react'
import './index.less'

import reactLogo from '@/assets/react.svg'
import vueLogo from '@/assets/vue.svg'
import { useAppDispatch, useAppSelector } from '@/store'
import { getPathAsync } from '@/store/app'

export default function index() {
  const [check, setCheck] = useState(false)

  const { createPath } = useAppSelector(({ app }) => app)
  console.log(createPath)
  const dispatch = useAppDispatch()

  const more = useMemo(() => {
    const menu = (
      <Menu style={{ backgroundColor: '#00141b' }}>
        <Menu.Item key="1" style={{ backgroundColor: '#000000' }}>
          <FileAddOutlined style={{ marginRight: 5 }} />
          新建文件夹
        </Menu.Item>
        <Menu.Item key="2" style={{ backgroundColor: '#00141b' }}>
          <EyeOutlined style={{ marginRight: 5 }} />
          显示隐藏文件夹
          <Switch checked={check} onChange={setCheck} style={{ marginLeft: 5 }} />
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="create-header-item">
        <Dropdown overlay={menu} placement="bottomRight">
          <MoreOutlined />
        </Dropdown>
      </div>
    )
  }, [check])

  return (
    <div className="admin-create">
      <div className="create-header">
        <div className="create-header-item">
          <UpOutlined />
        </div>
        {createPath.path.map((key, index) => {
          return index + 1 === createPath.path.length ? (
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
        {more}
      </div>
      <div className="create-folder">
        {createPath.folderList.map(({ folderName, frame }) => {
          if (folderName.startsWith('.') && !check) return ''
          return (
            <div key={folderName}>
              {frame ? <FolderFilled /> : <FolderOutlined />}
              {folderName}
              {frame === 'vue' && <img src={vueLogo} alt="" />}
              {frame === 'react' && <img src={reactLogo} alt="" />}
            </div>
          )
        })}
      </div>
      <div className="create-btn">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => dispatch(getPathAsync({ path: 'D:\\code\\mkw\\test' }))}
        >
          在此处创建新项目
        </Button>
      </div>
    </div>
  )
}
