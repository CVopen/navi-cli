import React, { useEffect, useState, FC } from 'react'
import { getTemplateList, delTemplate } from '@/api/template'
import NoData from '@/components/NoData'
import { Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'

import './index.less'
import Modal from './Modal'
import { useAppSelector } from '@/store'

export interface templateItem {
  name: string
  label: string
  ignore: string[]
  id: string
}

export type Visible = 0 | 1 | 2

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
    <div className="admin-template">
      {!!list.length && (
        <div className="admin-template-add">
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => navigate(`/${frame}`)}>
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
          <>
            {list.map(({ name, label, id, ignore = [] }) => {
              return (
                <div className="admin-template-item" key={id}>
                  <ul>
                    <li>
                      <span>描述: </span>
                      {label}
                    </li>
                    <li>
                      <span>名称: </span>
                      {name}
                    </li>
                    <li>
                      <span>忽略文件: </span>
                      {ignore.reduce((target, current, index) => {
                        if (index > 1) return target
                        if (target) {
                          target += `、 ${current}`
                        } else {
                          target = current
                        }
                        return target
                      }, '')}
                    </li>
                  </ul>
                  <div>
                    <Button
                      type="primary"
                      onClick={handleEdit({ name, label, id, ignore })}
                      style={{ marginRight: 10 }}
                    >
                      修改模板
                    </Button>
                    <Button type="primary" danger onClick={del({ name, label, id, ignore })}>
                      删除模板
                    </Button>
                  </div>
                </div>
              )
            })}
          </>
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
