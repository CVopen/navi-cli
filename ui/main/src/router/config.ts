import React from 'react'

const routes = [
  { path: 'select', element: React.lazy(() => import('../pages/select')) },
  { path: 'about', element: React.lazy(() => import('../pages/About')) },
  {
    path: '/',
    element: React.lazy(() => import('../pages/Admin')),
    children: [
      { path: 'project', element: React.lazy(() => import('../pages/Project')) },
      { path: 'create', element: React.lazy(() => import('../pages/Create')) },
      { path: 'command', element: React.lazy(() => import('../pages/Command')) },
      { path: 'template', element: React.lazy(() => import('../pages/Template')) },
    ],
  },
]

export default routes
