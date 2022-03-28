import {useLocation} from 'react-router-dom'
import {store} from '../store'

function beforeRoute(): [boolean, string] {
  const pathname = useLocation().pathname
  const appStore = store.getState().app
  
  if (appStore.frame && pathname === '/select') return [false, '/home']
  if (!appStore.frame && !['/select', '/about'].includes(pathname)) return [false, '/select']
  
  if (pathname === '/') return [false, 'home']
  
  return [true, 'home']
}

export default beforeRoute
