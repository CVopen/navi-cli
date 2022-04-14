import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'antd/dist/antd.css'
import './styles/index.less'

import RouteList from './router'
import { store, useAppDispatch } from './store'
import { socketInstance } from './store/app'

const App: React.FC = () => {
  const [mask, setMask] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (WebSocket) {
      const socket = new WebSocket('ws://localhost:8888/ws')
      socket.onclose = () => setMask(true)
      dispatch(socketInstance(socket))
    }
  }, [])

  return (
    <>
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
    </>
  )
}

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}
