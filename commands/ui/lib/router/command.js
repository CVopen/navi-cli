const express = require('express')
const { getList } = require('../controller/command')
const { sendData } = require('../utils')

const routerCommand = express.Router()

routerCommand.get('/ui/command/list', (_, res) => {
  res.json(sendData(getList()))
})

routerCommand.post('/ui/command/list', (req, res) => {
  console.log(req.body)
  res.json({
    name: 'open',
    age: 18,
  })
})

module.exports = routerCommand
