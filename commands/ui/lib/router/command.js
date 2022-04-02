const express = require('express')

const routerCommand = express.Router()

routerCommand.get('/ui/list', (req, res) => {
  console.log(req.query)
  res.json({
    name: 'open',
    age: 18,
  })
})

routerCommand.post('/ui/list', (req, res) => {
  console.log(req.body)
  res.json({
    name: 'open',
    age: 18,
  })
})

module.exports = routerCommand
