import React from 'react'

import 'antd/dist/antd.css'

import { HashRouter, BrowserRouter } from 'react-router-dom'

import RouteList from './router'

const App: React.FC = () => {
  return (
    <>
      <h1>route6</h1>
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>

      <div id="subapp-container" />
    </>
  )
}

export default App
