const express = require('express')
const { getList, addTemplate, delTemplate, updateTemplate } = require('../controller/template')
const { sendData } = require('../utils')

const routerTemplate = express.Router()

routerTemplate.get('/ui/template/list', (_, res) => {
  res.json(sendData(getList()))
})

routerTemplate.post('/ui/template/add', (req, res) => {
  addTemplate(req.body).then((result) => {
    res.json(sendData(...result))
  })
})

routerTemplate.delete('/ui/template/del', (req, res) => {
  res.json(sendData(...delTemplate(req.query)))
})

routerTemplate.put('/ui/template/update', (req, res) => {
  res.json(sendData(...updateTemplate(req.body)))
})

module.exports = routerTemplate
