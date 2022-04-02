import React from 'react'
import Header from '@/components/Header'

import { PlusSquareOutlined, SnippetsOutlined, FundProjectionScreenOutlined } from '@ant-design/icons'

import { Layout, Tabs } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

import './index.less'

const { Content } = Layout
const { TabPane } = Tabs

export default function index() {
  const navigate = useNavigate()

  const handleClick = (key: string) => navigate(key)
  return (
    <Layout style={{ height: '100%', background: 'transparent' }}>
      <Header />
      <Content style={{ height: '100%' }}>
        <div className="admin-content">
          <Tabs defaultActiveKey={useLocation().pathname} onTabClick={handleClick}>
            <TabPane
              tab={
                <span>
                  <SnippetsOutlined size={50} />项 目
                </span>
              }
              key="/project"
            />
            <TabPane
              tab={
                <span>
                  <PlusSquareOutlined size={50} />创 建
                </span>
              }
              key="/establish"
            />
            <TabPane
              tab={
                <span>
                  <FundProjectionScreenOutlined size={50} />命 令
                </span>
              }
              key="/command"
            />
          </Tabs>
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}
