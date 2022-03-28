import React from 'react'
import { increment, selectProject } from '../../store/app'
import { useAppSelector, useAppDispatch } from '../../store'

export default function index() {
  const { app } = useAppSelector((state) => state)
  // 获取dispath用于向store中派发方法
  const dispatch = useAppDispatch()

  return (
    <div>
      <div>home</div>
      <h1>学习@reduxjs/toolkit</h1>
      {/* <button onClick={() => dispatch(increment())}>{app.value} 加一</button> */}
      <button onClick={() => dispatch(selectProject('vue'))}>{app.value} 加一</button>
    </div>
  )
}
