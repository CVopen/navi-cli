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
  DatabaseOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Menu, Switch } from 'antd'
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import './index.less'

import reactLogo from '@/assets/react.svg'
import vueLogo from '@/assets/vue.svg'
import { useAppDispatch, useAppSelector } from '@/store'
import { getPathAsync } from '@/store/app'
import { checkPlatFormToWin, transformPath } from '@/utils'
import { getDisc } from '@/api'
import Modal from './Modal'

export default function index() {
  const [check, setCheck] = useState(false)
  const [discList, setDisc] = useState<string[]>([])
  const [isModalVisible, setIsModalVisible] = useState(true)

  const { createPath } = useAppSelector(({ app }) => app)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (createPath.path.length) {
      getDisc().then((res) => {
        setDisc(res.filter((discName) => !createPath.path.includes(discName)))
      })
    } else {
      dispatch(getPathAsync())
    }
  }, [createPath])

  const more = useMemo(() => {
    const onSelect = ({ key }: any) => {
      key === '1' && setIsModalVisible(true)
    }
    const menu = (
      <Menu style={{ backgroundColor: '#00141b' }} onClick={onSelect}>
        <Menu.Item key="1" style={{ backgroundColor: '#00141b' }}>
          <FileAddOutlined style={{ marginRight: 10 }} />
          新建文件夹
        </Menu.Item>
        <Menu.Item key="2" style={{ backgroundColor: '#00141b' }}>
          <EyeOutlined style={{ marginRight: 10 }} />
          显示隐藏文件夹
          <Switch checked={check} onChange={setCheck} style={{ marginLeft: 10 }} />
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

  const disc = useCallback(
    (child: ReactNode) => {
      const onSelect = ({ key }: any) => {
        dispatch(getPathAsync({ path: `${key}/` }))
      }
      const menu = (
        <Menu style={{ backgroundColor: '#00141b' }} onClick={onSelect}>
          {discList.map((discName) => (
            <Menu.Item key={discName} style={{ backgroundColor: '#00141b' }}>
              <DatabaseOutlined style={{ marginRight: 10 }} />
              可选磁盘: {discName}
            </Menu.Item>
          ))}
        </Menu>
      )
      return (
        <Dropdown overlay={menu} placement="bottom">
          {child}
        </Dropdown>
      )
    },
    [discList],
  )

  const freshen = useCallback(
    (nameOrIndex?: string | number) => {
      return () => {
        let pathList = createPath.path
        if (typeof nameOrIndex === 'string') {
          pathList = [...pathList, nameOrIndex]
        } else if (typeof nameOrIndex === 'number') {
          pathList = pathList.slice(0, nameOrIndex + 1)
        }
        const path = transformPath(pathList)
        if (!path) return
        dispatch(getPathAsync({ path: transformPath(pathList) }))
      }
    },
    [createPath],
  )

  const isShowDisc = (index: number) => {
    return !index && checkPlatFormToWin()
  }

  return (
    <div className="admin-create">
      <Modal isModalVisible={isModalVisible} setShow={setIsModalVisible} />
      <div className="create-header">
        <div className="create-header-item">
          <UpOutlined onClick={freshen(createPath.path.length - 2)} />
        </div>
        {createPath.path.map((key, index) => {
          return index + 1 === createPath.path.length ? (
            <div className="create-header-item" key={key} style={{ flex: 1 }}>
              <span>{key}</span>
              <EditOutlined style={{ float: 'right', marginTop: 5 }} />
            </div>
          ) : (
            <div className="create-header-item" key={key || '/'}>
              {isShowDisc(index) ? (
                disc(<span onClick={freshen(index)}>{key || '/'}</span>)
              ) : (
                <span onClick={freshen(index)}>{key || '/'}</span>
              )}
            </div>
          )
        })}
        <div className="create-header-item">
          <RedoOutlined onClick={freshen()} />
        </div>
        {more}
      </div>
      <div className="create-folder">
        {createPath.folderList.map(({ folderName, frame }) => {
          if ((folderName.startsWith('.') || folderName.startsWith('$')) && !check) return ''
          return (
            <div key={folderName} onClick={freshen(folderName)}>
              {frame ? <FolderFilled /> : <FolderOutlined />}
              {folderName}
              {frame === 'vue' && <img src={vueLogo} alt="" />}
              {frame === 'react' && <img src={reactLogo} alt="" />}
            </div>
          )
        })}
      </div>
      <div className="create-btn">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => dispatch(getPathAsync())}>
          在此处创建新项目
        </Button>
      </div>
    </div>
  )
}
