import React from 'react'

import 'antd/dist/antd.css'

import { HashRouter, BrowserRouter } from 'react-router-dom'

import RouteList from './router'

const App: React.FC = () => {
  return (
    <>
      <h1>我是react子应用1.1.13</h1>
      <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/react' : '/'}>
        <RouteList />
      </BrowserRouter>
    </>
  )
}

export default App
