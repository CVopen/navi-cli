import { getCommandList } from '@/api/command'
import { Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'

import './index.less'

interface CommandItem {
  name: string
  optionalParam?: string
  requiredParam?: string
  cmd: string
  description: string
  packageName?: string
  targetPath?: string
  option?: string[] | string[][]
}

export default function index() {
  const [list, setList] = useState<CommandItem[]>([])
  const [active, setActive] = useState<CommandItem>()

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

  const handleClick = (current: CommandItem) => {
    return () => setActive(current)
  }

  return (
    <div className="admin-command">
      <Skeleton active loading={!list.length}>
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
        <div className="command-content">from</div>
      </Skeleton>
    </div>
  )
}
