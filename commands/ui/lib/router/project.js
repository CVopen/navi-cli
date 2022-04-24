const express = require('express')

const { getList, openFold, getPath } = require('../controller/project')
const { sendData } = require('../utils')

const routerProject = express.Router()

routerProject.get('/ui/project/list', (_, res) => {
  res.json(sendData(getList()))
})

routerProject.post('/ui/project/open', (req, res) => {
  openFold(req.body).then((result) => {
    res.json(sendData(result))
  })
})

routerProject.get('/ui/project/path', (req, res) => {
  res.json(sendData(getPath(req.query)))
})

module.exports = routerProject
