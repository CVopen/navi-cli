const express = require('express')
const { getList, addCommand } = require('../controller/command')
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

module.exports = routerCommand
