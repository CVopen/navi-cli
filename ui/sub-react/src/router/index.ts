import { useRoutes } from 'react-router-dom'

import prepareRoutes from './prepareRoute'

export default () => useRoutes(prepareRoutes())
