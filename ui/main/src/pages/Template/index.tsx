import React, { useEffect, useState, FC, memo } from 'react'
import { getTemplateList, delTemplate } from '@/api'
import NoData from '@/components/NoData'
import { Button, message, notification, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'

import './index.less'
import Modal from './Modal'
import { useAppSelector } from '@/store'
import { formatDate } from '@/utils'

export interface templateItem {
  name: string
  label: string
  id: string
  date?: string
}

export type Visible = 0 | 1 | 2

interface ItemProps {
  list: templateItem[]
  setList: (list: templateItem[]) => void
  setIsModalVisible: (value: Visible) => void
  setActive: (value: templateItem) => void
}

const index: FC = () => {
  const frame = useAppSelector((store) => store.app.frame)
  const navigate = useNavigate()
  const [list, setList] = useState<templateItem[]>([])
  const [active, setActive] = useState<templateItem>()
  const [isModalVisible, setIsModalVisible] = useState<Visible>(0)

  useEffect(() => {
    getList()
  }, [])

  const getList = () => {
    getTemplateList().then((res) => {
      const list = res as unknown as templateItem[]
      if (list.length) setActive(list[0])
      setList(list)
    })
  }

  return (
    <div className="admin-template">
      {!!list.length && (
        <div className="admin-template-add">
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              notification.info({
                message: '模板功能',
                description: '创建模板功能正在开发中, 请等待一段时间.',
              })
              navigate(`/${frame}`)
            }}
          >
            创建模板
          </Button>
          <Button type="primary" onClick={() => setIsModalVisible(1)}>
            导入模板
          </Button>
        </div>
      )}
      <Modal
        visible={isModalVisible}
        setVisble={setIsModalVisible}
        setList={setList}
        list={list}
        defaultValue={active}
        setActive={setActive}
      />
      <div className="admin-template-content">
        {list.length ? (
          <Item setList={setList} setActive={setActive} setIsModalVisible={setIsModalVisible} list={list} />
        ) : (
          <NoData content="您还未创建过自己的模板">
            <Button type="primary" onClick={() => setIsModalVisible(1)}>
              添加模板
            </Button>
          </NoData>
        )}
      </div>
    </div>
  )
}

export default index

const Item: FC<ItemProps> = memo(({ list, setActive, setList, setIsModalVisible }) => {
  const handleEdit = (current: templateItem) => () => {
    setActive(current)
    setIsModalVisible(2)
  }

  const del = (current: templateItem) => () => {
    delTemplate({ id: current?.id as string }).then(() => {
      const data = list.filter(({ id }) => id !== current?.id)
      setList([...data])
      setActive(data[0])
      message.success('删除成功')
    })
  }

  return (
    <>
      {list.map(({ name, label, id, date }, index) => (
        <div className="admin-template-item" key={id || index}>
          <ul>
            <li>
              <span>描述: </span>
              <Tooltip placement="top" title={label}>
                {label}
              </Tooltip>
            </li>
            <li>
              <span>名称: </span>
              <Tooltip placement="top" title={name}>
                {name}
              </Tooltip>
            </li>
            {date && (
              <li>
                <span>时间: </span>
                <span>{formatDate(date)}</span>
              </li>
            )}
          </ul>
          {id ? (
            <div>
              <Button type="primary" onClick={handleEdit({ name, label, id })}>
                修改模板
              </Button>
              <Button type="primary" danger onClick={del({ name, label, id })} style={{ marginLeft: 10 }}>
                删除模板
              </Button>
            </div>
          ) : (
            <div style={{ height: 42 }} />
          )}
        </div>
      ))}
    </>
  )
})
