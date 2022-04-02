import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'sub-react',
    entry: `//localhost:${process.env.NODE_ENV === 'production' ? 8888 : 4001}/react/`,
    container: '#subapp-container',
    activeRule: '/react',
  },
])

start()
