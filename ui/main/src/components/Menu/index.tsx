import React, { memo } from 'react'

import './index.less'

interface Props<T> {
  list: T[]
  active: T | undefined
  click: (arg: number) => () => void
  isKey: keyof T
}

function Menu<T extends { name: string }>({ list, active, click, isKey }: Props<T>) {
  return (
    <ul className="menu">
      {list.map((item: T, index: number) => (
        <li
          key={item[isKey] as unknown as string}
          className={active ? (active[isKey] === item[isKey] ? 'active' : '') : ''}
          onClick={click(index)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}

export default memo(Menu)
