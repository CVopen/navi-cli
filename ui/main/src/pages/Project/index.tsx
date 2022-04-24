import { getProjectList } from '@/api'
import Menu from '@/components/Menu'
import NoData from '@/components/NoData'
import React, { useCallback, useEffect, useState } from 'react'
import './index.less'
import Info from './Info'
import Task from './Task'

export interface ProjectItem {
  name: string
  createTime: string
  installCommand: string
  startCommand: string
  buildCommand: string
  local: string
}

export default function index() {
  const [list, setList] = useState<ProjectItem[]>([])
  const [active, setActive] = useState<ProjectItem>()

  useEffect(() => {
    getList()
  }, [])

  const handleClick = useCallback((index: number) => () => setActive(list[index]), [list])

  const getList = () => {
    getProjectList().then((res) => {
      const list = res as unknown as ProjectItem[]
      setList(list)
      if (list.length) setActive(list[0])
    })
  }

  return (
    <div className="admin-project">
      {list.length ? (
        <>
          {' '}
          <Menu list={list} click={handleClick} active={active} isKey={'local' as never} />
          <div className="project-content">
            <Info active={active as ProjectItem} />
            <Task active={active as ProjectItem} />
          </div>
        </>
      ) : (
        <NoData content="您还未创建过自己的模板" />
      )}
    </div>
  )
}
