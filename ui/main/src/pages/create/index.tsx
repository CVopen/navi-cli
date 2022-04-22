import { getPath } from '@/api'
import React, { useEffect, useState } from 'react'
import './index.less'

export default function index() {
  const [paths, setPath] = useState<string[]>([])
  useEffect(() => {
    getPath().then(setPath)
  }, [])
  return <div className="admin-create">{paths}</div>
}
