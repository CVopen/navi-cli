import React, { useEffect, useState } from 'react'
import { selectFrame, selectBuild } from '@/store/app'
import { useAppDispatch } from '@/store'
import './index.less'

import { useNavigate } from 'react-router-dom'

import reactLogo from '@/assets/react.svg'
import vueLogo from '@/assets/vue.svg'
import webpackLogo from '@/assets/webpack.svg'
import viteLogo from '@/assets/vite.svg'

import { session } from '@/utils/storage'

import Header from '@/components/Header'

type keys = 'vue' | 'react' | 'webpack' | 'vite'
type selectList = {
  key: keys
  src: typeof vueLogo
}[]

export default function index() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [active, setActive] = useState(false)
  const [list, setList] = useState<selectList>([
    { key: 'vue', src: vueLogo },
    { key: 'react', src: reactLogo },
  ])

  const bootstrap = (key: keys) => {
    if (key === 'vue' || key === 'react') {
      dispatch(selectFrame(key))
      setActive(true)
      session.setItem('frame', key)
    }
    if (key === 'webpack' || key === 'vite') {
      dispatch(selectBuild(key))
      navigate('/project')
      session.setItem('build', key)
    }
  }

  useEffect(() => {
    if (!active) return
    setTimeout(() => {
      setList([
        { key: 'webpack', src: webpackLogo },
        { key: 'vite', src: viteLogo },
      ])
      setActive(false)
    }, 1000)
  }, [active])

  return (
    <div className="page-select">
      <Header />
      <div style={{ opacity: active ? 0 : 1 }}>
        {list.map(({ key, src }) => (
          <img src={src} key={key} onClick={() => bootstrap(key)} />
        ))}
      </div>
    </div>
  )
}
