import { ContainerOutlined } from '@ant-design/icons'
import { Card, Button } from 'antd'
import React, { memo, useEffect, useRef, useMemo } from 'react'

import { useAppSelector } from '@/store'
import { ProjectItem } from '.'
import { strToJson } from '@/utils'

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

import { theme } from './constant'

const type = {
  START: 'startTime',
  END: 'endTime',
  DATA: 'data',
  ERROR: 'error',
}

const Task = ({ active }: { active: ProjectItem }) => {
  const socket = useAppSelector((store) => store.app.socket)

  const installTime = useRef({ start: '', end: '' })

  const terminal = useRef<HTMLDivElement>(null)

  const term = useMemo(
    () =>
      new Terminal({
        rendererType: 'canvas', // 渲染类型
        rows: 40,
        cols: 20,
        disableStdin: true,
        theme,
      }),
    [],
  )

  useEffect(() => {
    initXterm()
    if (!socket) return
    socket.onmessage = function (e) {
      const data = strToJson(e.data)
      switch (data.type) {
        case type.DATA:
          data.data.split('\n').forEach((str: string) => term.writeln(str))
          break
        case type.END:
          // setContent(contentRef.current)
          break
        default:
          break
      }
    }
  }, [])

  const startTask = () => {
    socket?.send(JSON.stringify({ type: 'start', data: active.local }))
  }

  const buildTask = () => {
    socket?.send(JSON.stringify({ type: 'build', data: active.local }))
  }

  const initXterm = () => {
    // 创建terminal实例
    term.open(terminal.current as HTMLElement)
    // canvas背景全屏
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    fitAddon.fit()
  }

  return (
    <Card
      title={
        <div className="info-title">
          <ContainerOutlined className="icon" />
          任务
          {active?.buildCommand && (
            <Button type="primary" onClick={buildTask}>
              打包
            </Button>
          )}
          {active?.startCommand && (
            <Button type="primary" style={{ marginRight: 10 }} onClick={startTask}>
              启动
            </Button>
          )}
        </div>
      }
      bordered={false}
    >
      <div className="terminal">
        <div className="terminal-header">
          <span />
          <span />
          <span />
        </div>
        <div style={{ height: 300 }} ref={terminal} />
      </div>
    </Card>
  )
}

export default memo(Task)
