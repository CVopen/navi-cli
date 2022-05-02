const express = require('express')
const { handleGetList, handleAddCommand, handleDelCommand, handleUpdateCommand } = require('../controller/command')
const { sendData } = require('../utils')

const routerCommand = express.Router()

routerCommand.get('/ui/command/list', (_, res) => {
  res.json(sendData(handleGetList()))
})

routerCommand.post('/ui/command/add', (req, res) => {
  handleAddCommand(req.body).then((result) => {
    res.json(sendData(...result))
  })
})

routerCommand.delete('/ui/command/del', (req, res) => {
  res.json(sendData(...handleDelCommand(req.query)))
})

routerCommand.put('/ui/command/update', (req, res) => {
  res.json(sendData(...handleUpdateCommand(req.body)))
})

module.exports = routerCommand
