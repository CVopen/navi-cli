import React, { FC } from 'react'

import { CommandItem } from './index'

const Content: FC<{ current?: CommandItem }> = ({ current }) => {
  return <div className="command-content">{current?.name}</div>
}

export default Content
