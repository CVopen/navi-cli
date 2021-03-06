import React, { ReactNode, FC, Suspense } from 'react'
import { Navigate } from 'react-router-dom'

import config from './config'

import beforeRoute from './beforeRoute'

type route = typeof config[number]

interface router {
  path: string
  element: ReactNode
  children?: router[]
}

const Auth: FC = ({ children }) => {
  const [isPass, path] = beforeRoute()
  if (!isPass) return <Navigate to={path} />
  return <Suspense fallback={<div>路由懒加载...</div>}>{children}</Suspense>
}

function routeItem(item: route): router {
  const Page = item.element
  return {
    path: item.path,
    element: (
      <Auth>
        <Page />
      </Auth>
    ),
  }
}

function prepareRoutes(): router[] {
  return config.map((item) => {
    let children: router[] = []
    if (item.children) {
      children = item.children.map((i) => routeItem(i as route))
    }
    return { ...routeItem(item), children }
  })
}

export default prepareRoutes
