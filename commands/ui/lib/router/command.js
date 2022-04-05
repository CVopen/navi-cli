const express = require('express')
const { getList, addCommand, delCommand, updateCommand } = require('../controller/command')
const { sendData } = require('../utils')

const routerCommand = express.Router()

routerCommand.get('/ui/command/list', (_, res) => {
  res.json(sendData(getList()))
})

routerCommand.post('/ui/command/add', (req, res) => {
  addCommand(req.body).then((result) => {
    res.json(sendData(...result))
  })
})

routerCommand.delete('/ui/command/del', (req, res) => {
  res.json(sendData(...delCommand(req.query)))
})

routerCommand.put('/ui/command/update', (req, res) => {
  res.json(sendData(...updateCommand(req.body)))
})

module.exports = routerCommand
