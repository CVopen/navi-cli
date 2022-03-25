import React from 'react'
import { Link, Outlet } from 'react-router-dom'

import Hello from '@/components/Hello'

function App() {
  return (
    <div>
      <Hello />
      <Link to="/login">login</Link>
      <Link to="/home">home</Link>
      <Link to="/register">register</Link>
      <br />
      <Link to="/app-react">app-react</Link>
      <br />
      <Link to="/app-vue">app-vue</Link>
      <Outlet />
    </div>
  )
}

export default App
