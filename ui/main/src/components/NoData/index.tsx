import { FrownOutlined } from '@ant-design/icons'
import React, { ReactNode, memo } from 'react'

import './index.less'

interface NoDataProps {
  content?: string
  icon?: ReactNode
  children?: ReactNode
  style?: CSSStyleDeclaration
}

function index({ content = '暂时没有数据', icon = <FrownOutlined className="index-icon" />, children }: NoDataProps) {
  return (
    <div className="no-data">
      {icon}
      <h3>{content}</h3>
      {children}
    </div>
  )
}

export default memo(index)
