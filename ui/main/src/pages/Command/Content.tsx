import { delCommand } from '@/api'
import { Button, message } from 'antd'
import React, { FC, memo } from 'react'

import { CommandItem } from './index'

interface Props {
  showModal: Function
  current?: CommandItem
  setList: Function
  list: CommandItem[]
  setActive: Function
}

interface Option {
  args: string
  defaults?: boolean
  description?: string
}

const Content: FC<Props> = ({ current, showModal, setList, list, setActive }) => {
  const del = () => {
    delCommand({ id: current?.id as string }).then(() => {
      const data = list.filter(({ name }) => name !== current?.name)
      setList([...data])
      setActive(data[0])
      message.success('删除成功')
    })
  }

  const renderOption = () => {
    if (!current?.option || !current?.option?.length) return <></>
    let content: Option[] = []
    if (Array.isArray(current.option[0])) {
      content = current.option.map((str: any) => {
        const option: Option = { args: '' }
        option.args = str[0].match(/--(.*)/)[1]
        option.defaults = str[2]
        option.description = str[1]
        return option
      })
    } else {
      const arg = current?.option[0].match(/--(.*)/)
      content.push({
        args: arg ? arg[1] : '',
        defaults: current.option[2] as unknown as boolean,
        description: current.option[1] as string,
      })
    }
    return (
      <>
        <h3>命令选项:</h3>
        <div className="command-option">
          {content.map(({ args, defaults, description }) => (
            <ul key={args}>
              <li>
                <span>参数: </span> {args}
              </li>
              <li>
                <span>默认值: </span> {typeof defaults === 'boolean' ? defaults.toString() : ''}
              </li>
              <li>
                <span>描述: </span> {description}
              </li>
            </ul>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="command-content">
      {Number(current?.id)}
      <h2>
        <span className="command-content-name">
          command: <span>{current?.name}</span>
        </span>
        <div>
          <Button type="primary" onClick={() => showModal(1)} style={{ marginRight: 10 }}>
            添加命令
          </Button>
          {!Number(current?.id) && (
            <>
              <Button type="primary" onClick={() => showModal(2)} style={{ marginRight: 10 }}>
                修改命令
              </Button>
              <Button type="primary" danger onClick={del}>
                删除命令
              </Button>
            </>
          )}
        </div>
      </h2>
      <p>
        <span>命令描述: </span> {current?.description}
      </p>
      {current?.packageName && (
        <p>
          <span>执行包名: </span> {current?.packageName}
        </p>
      )}
      {current?.requiredParam && (
        <p>
          <span>必选参数: </span> {current?.requiredParam}
        </p>
      )}
      {current?.optionalParam && (
        <p>
          <span>可选参数: </span> {current?.optionalParam}
        </p>
      )}
      {current?.targetPath && (
        <p>
          <span>调试路径: </span> {current?.targetPath}
        </p>
      )}
      {renderOption()}
    </div>
  )
}

export default memo(Content)
