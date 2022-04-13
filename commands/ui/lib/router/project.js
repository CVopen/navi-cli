const express = require('express')
const { getList, openFold } = require('../controller/project')
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

module.exports = routerProject
