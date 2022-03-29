import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.less'

import { Button } from 'antd'

export default function index() {
  const navigate = useNavigate()
  const document = [
    { name: 'Blog', link: 'http://xyhopen.top/ark/' },
    { name: 'GitHub', link: 'https://github.com/CVopen' },
    { name: 'Repository', link: 'https://github.com/CVopen/navi-cli' },
    { name: 'qiankun', link: 'https://qiankun.umijs.org/' },
  ]

  return (
    <div className="page-about">
      <h1>关于</h1>
      <p>
        <a href="https://github.com/CVopen/navi-cli/tree/master/ui" target="_blank">
          @navi-cli/ui
        </a>{' '}
        是 navi-cli 内置的一套成熟UI.
      </p>
      <blockquote>
        目前国内前端框架两分天下(vue和react), 打包工具除了webpack也有后起之秀vite.
        语言也从JavaScript逐渐向typescript靠拢。 但是, 各种脚手架提供的模板可能并不太符合我们的开发需求,
        自己配置复杂而且繁琐. 局限的命令并不方便我们做到更多的事情, 一个成熟的ui将解锁更多可能. 总的来说, navi-cli
        能够支持您的自定义命令, 且基于 qiankun 能让你获得更多属于自己模板。
      </blockquote>
      <div>
        {document.map(({ name, link }) => (
          <a href={link} target="_blank" key={name}>
            {name}
          </a>
        ))}
      </div>
      <Button type="primary" onClick={() => navigate(-1)}>
        back
      </Button>
    </div>
  )
}
