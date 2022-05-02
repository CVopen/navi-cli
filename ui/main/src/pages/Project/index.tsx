import { getProjectList } from '@/api'
import Menu from '@/components/Menu'
import NoData from '@/components/NoData'
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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

  let [searchParams] = useSearchParams()

  useEffect(() => {
    getList()
  }, [])

  const handleClick = useCallback((index: number) => () => setActive(list[index]), [list])

  const getList = useCallback(() => {
    getProjectList().then((res) => {
      const list = res as unknown as ProjectItem[]
      setList(list)
      if (list.length) {
        let current = list[0]
        const local = searchParams.get('local')
        if (local) {
          current = list.find((item) => item.local === local) as ProjectItem
        }
        setActive(current)
      }
    })
  }, [])

  return (
    <div className="admin-project">
      {list.length ? (
        <>
          {' '}
          <Menu list={list} click={handleClick} active={active} isKey={'local' as never} />
          <div className="project-content">
            <Info active={active as ProjectItem} />
            <Task active={active as ProjectItem} getList={getList} />
          </div>
        </>
      ) : (
        <NoData content="您还未创建过自己的模板" />
      )}
    </div>
  )
}
