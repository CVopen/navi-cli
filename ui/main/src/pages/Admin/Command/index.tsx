import React, { useEffect, useState, FC, useCallback } from 'react'
import { getCommandList } from '@/api/command'
import NoData from '@/components/NoData'
import { Button } from 'antd'
import Content from './Content'

import './index.less'
import Modal from './Modal'

export interface CommandItem {
  name: string
  optionalParam?: string
  requiredParam?: string
  cmd: string
  description: string
  packageName?: string
  targetPath?: string
  option?: string[] | string[][]
  id: string
}

export type Visible = 0 | 1 | 2

const index: FC = () => {
  const [list, setList] = useState<CommandItem[]>([])
  const [active, setActive] = useState<CommandItem>()
  const [isModalVisible, setIsModalVisible] = useState<Visible>(0)

  useEffect(() => {
    getList()
  }, [])

  const getList = () => {
    getCommandList().then((res) => {
      const list = res as unknown as CommandItem[]
      tranformData(list)
      if (list.length) setActive(list[0])
      setList(list)
    })
  }

  const tranformData = (list: CommandItem[]) => {
    list.forEach((command) => {
      const cmdList = command.cmd.split(' ')
      for (const item of cmdList) {
        if (!item) continue
        if (item.startsWith('<')) {
          command.requiredParam = item.replace(/\<(.+?)\>/, (_, str) => str)
        } else if (item.startsWith('[')) {
          command.optionalParam = item.replace(/\[(.+?)\]/, (_, str) => str)
        } else {
          command.name = item
        }
      }
    })
  }

  const handleClick = (current: CommandItem) => () => setActive(current)

  const showModal = useCallback(() => {
    setIsModalVisible(1)
  }, [isModalVisible])

  return (
    <div className="admin-command">
      <Modal
        visible={isModalVisible}
        setVisble={setIsModalVisible}
        setList={setList}
        list={list}
        defaultValue={active}
        setActive={setActive}
      />
      {list.length ? (
        <>
          <ul className="command-select">
            {list.map((command) => (
              <li
                key={command.name}
                className={active?.name === command.name ? 'active' : ''}
                onClick={handleClick(command)}
              >
                {command.name}
              </li>
            ))}
          </ul>
          <Content current={active} showModal={setIsModalVisible} setList={setList} list={list} setActive={setActive} />
        </>
      ) : (
        <NoData content="您还未创建过命令">
          <Button type="primary" onClick={showModal}>
            添加命令
          </Button>
        </NoData>
      )}
    </div>
  )
}

export default index
