import {useLocation} from 'react-router-dom'
import {store} from '../store'

function beforeRoute(): [boolean, string] {
  const pathname = useLocation().pathname
  const appStore = store.getState().app
  
  if (appStore.frame && pathname === '/select') return [false, '/project']
  if (!appStore.frame && !['/select', '/about'].includes(pathname)) return [false, '/select']
  
  if (pathname === '/') return [false, 'project']
  
  return [true, 'project']
}

export default beforeRoute
