import { ContainerOutlined } from '@ant-design/icons'
import { Card, Button, notification } from 'antd'
import React, { memo, useEffect, useRef, useMemo, useState } from 'react'

import { useAppSelector } from '@/store'
import { ProjectItem } from '.'
import { strToJson } from '@/utils'

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

import { theme } from './constant'

const TYPE = {
  DATA: 'data',
  ERROR: 'error',
  START: 'start',
  END: 'end',
} as const

type ValueOf<T> = T[keyof T]

interface WsData {
  data: string
  type: ValueOf<typeof TYPE>
}

type Values<T> = T[keyof T]

interface Data {
  data: Values<typeof TYPE>
}

const Task = ({ active, getList }: { active: ProjectItem; getList: () => void }) => {
  const socket = useAppSelector((store) => store.app.socket)

  const [disable, setDisable] = useState(false)
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
    const handleToType = {
      [TYPE.DATA]: (data: WsData) => data.data.split('\n').forEach((str: string) => term.writeln(str)),
      [TYPE.ERROR](data: WsData) {
        getList()
        notification.error({
          message: '执行操作失败',
          description: `${data.data}, 将删除此记录.`,
        })
      },
      [TYPE.START]: () => setDisable(true),
      [TYPE.END]: () => setDisable(false),
    }

    socket.onmessage = function (e) {
      const data = strToJson<WsData>(e.data)
      handleToType[data.type](data)
    }
  }, [])

  useEffect(() => {
    if (!active || disable) return
    term.writeln(`$ projectName: <${active.name}>`)
    term.writeln('')
  }, [active, disable])

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
            <Button type="primary" disabled={disable} onClick={buildTask}>
              {disable ? 'loading' : '打包'}
            </Button>
          )}
          {active?.startCommand && (
            <Button type="primary" disabled={disable} style={{ marginRight: 10 }} onClick={startTask}>
              {disable ? 'loading' : '启动'}
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
