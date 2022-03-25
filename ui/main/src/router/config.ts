import React from 'react'

const routes = [
  {
    path: '/',
    element: React.lazy(() => import('../pages')),
    children: [
      { path: 'login', element: React.lazy(() => import('../pages/login')) },
      { path: 'register', element: React.lazy(() => import('../pages/register')) },
      { path: 'home', element: React.lazy(() => import('../pages/home')) },
    ],
  },
  {
    path: '*',
    // element: React.lazy(() => import('../pages/NoFound')),
    element: React.lazy(() => import('../pages')),
  },
]
export default routes
