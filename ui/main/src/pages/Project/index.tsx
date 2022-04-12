import Menu from '@/components/Menu'
import React, { useCallback, useState } from 'react'
import './index.less'

export type Visible = 0 | 1 | 2

interface ProjectItem {
  name: string
  createTime: string
  installCommand: string
  startCommand: string
  local: string
}

export default function index() {
  const listData = Array(100)
    .fill(0)
    .map((item, index) => ({
      name: `string${index}`,
      createTime: 'string',
      installCommand: 'string',
      startCommand: 'string',
      local: `string${index}`,
    }))
  const [list, setList] = useState<ProjectItem[]>(listData)
  const [active, setActive] = useState<ProjectItem>(listData[0])
  const [isModalVisible, setIsModalVisible] = useState<Visible>(0)

  const handleClick = useCallback((index: number) => () => setActive(list[index]), [list])

  return (
    <div className="admin-project">
      <Menu list={list} click={handleClick} active={active} isKey={'local' as never} />
      <div className="project-content">123</div>
    </div>
  )
}
