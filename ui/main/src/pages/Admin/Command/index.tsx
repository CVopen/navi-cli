import { getCommandList } from '@/api/command'
import NoData from '@/components/NoData'
import { Button } from 'antd'
import React, { useEffect, useState, FC } from 'react'
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
}

const index: FC = () => {
  const [list, setList] = useState<CommandItem[]>([])
  const [active, setActive] = useState<CommandItem>()
  const [isModalVisible, setIsModalVisible] = useState(true)

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
          command.requiredParam = item
        } else if (item.startsWith('[')) {
          command.optionalParam = item
        } else {
          command.name = item
        }
      }
    })
  }

  const handleClick = (current: CommandItem) => () => setActive(current)

  const showModal = () => {
    setIsModalVisible(true)
  }

  return (
    <div className="admin-command">
      <Modal visible={isModalVisible} setVisble={setIsModalVisible} />
      {!list.length ? (
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
          <Content current={active} />
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
