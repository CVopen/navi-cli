const express = require('express')
const { handleGetList, handleAddTemplate, handleDelTemplate, handleUpdateTemplate } = require('../controller/template')
const { sendData } = require('../utils')

const routerTemplate = express.Router()

routerTemplate.get('/ui/template/list', (_, res) => {
  res.json(sendData(handleGetList()))
})

routerTemplate.post('/ui/template/add', (req, res) => {
  handleAddTemplate(req.body).then((result) => {
    res.json(sendData(...result))
  })
})

routerTemplate.delete('/ui/template/del', (req, res) => {
  res.json(sendData(...handleDelTemplate(req.query)))
})

routerTemplate.put('/ui/template/update', (req, res) => {
  res.json(sendData(...handleUpdateTemplate(req.body)))
})

module.exports = routerTemplate
