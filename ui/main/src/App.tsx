import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'antd/dist/antd.css'
import './styles/index.less'

import RouteList from './router'
import { store } from './store'

const App: React.FC = () => {
  const [mask, setMask] = useState<boolean>(false)

  useEffect(() => {
    if (WebSocket) {
      const socket = new WebSocket('ws://localhost:8888/ws')
      socket.onclose = () => setMask(true)
    }
  }, [])

  return (
    <Provider store={store}>
      {mask && (
        <div className="mask">
          <p>您已断开连接</p>
          <p>You have been disconnected</p>
        </div>
      )}
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>
      <div id="subapp-container" />
    </Provider>
  )
}

export default App
