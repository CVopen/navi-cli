import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'antd/dist/antd.css'

import RouteList from './router'
import { store } from './store'

const App: React.FC = () => {
  console.log(store.getState())
  return (
    <Provider store={store}>
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>
      <div id="subapp-container" />
    </Provider>
  )
}

export default App
