import React from 'react'

const routes = [
  { path: 'select', element: React.lazy(() => import('../pages/select')) },
  {
    path: '/',
    element: React.lazy(() => import('../pages')),
    children: [
      { path: 'home', element: React.lazy(() => import('../pages/home')) },
      { path: 'login', element: React.lazy(() => import('../pages/login')) },
      { path: 'register', element: React.lazy(() => import('../pages/register')) },
    ],
  },
]

export default routes
