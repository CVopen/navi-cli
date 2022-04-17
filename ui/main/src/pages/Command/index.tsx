import React, { useEffect, useState, FC, useCallback } from 'react'
import { getCommandList } from '@/api'
import NoData from '@/components/NoData'
import { Button } from 'antd'
import Content from './Content'

import './index.less'
import Modal from './Modal'
import Menu from '@/components/Menu'

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
    list.forEach((command, index) => {
      const cmdList = command.cmd.split(' ')
      if (!command.id) {
        command.id = (index + 1).toString()
      }
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

  const handleClick = useCallback((index: number) => () => setActive(list[index]), [list])

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
          <Menu list={list} click={handleClick} active={active} isKey={'id' as never} />
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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
    // Error. This condition will always return 'false' since the types 'T[keyof T]' and 'string' have no overlap.ts(2367)
    return 1
  }
  return 0
}
const x = { name: 'abc' }
const y = { name: 'def' }
descendingComparator(x, y, 'name')
