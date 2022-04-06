import React from 'react'

const routes = [
  { path: 'select', element: React.lazy(() => import('../pages/select')) },
  { path: 'about', element: React.lazy(() => import('../pages/About')) },
  {
    path: '/',
    element: React.lazy(() => import('../pages/Admin')),
    children: [
      { path: 'project', element: React.lazy(() => import('../pages/Admin/Project')) },
      { path: 'establish', element: React.lazy(() => import('../pages/Admin/Establish')) },
      { path: 'command', element: React.lazy(() => import('../pages/Admin/Command')) },
      { path: 'template', element: React.lazy(() => import('../pages/Admin/Template')) },
    ],
  },
]

export default routes
