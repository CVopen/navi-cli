import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const { Header } = Layout

import './index.less'

export default function index() {
  const navigate = useNavigate()

  return (
    <Header className="navi-header">
      Navi-cli 项目管理器
      <QuestionCircleOutlined onClick={() => navigate('/about')} />
    </Header>
  )
}