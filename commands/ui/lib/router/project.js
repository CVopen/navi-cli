const express = require('express')

const {
  handleGetList,
  handleOpenFold,
  handleGetPath,
  handleGetDisc,
  handleGetTemplateInfo,
  handleCreateProject,
} = require('../controller/project')
const { sendData } = require('../utils')

const routerProject = express.Router()

routerProject.get('/ui/project/list', (_, res) => {
  res.json(sendData(handleGetList()))
})

routerProject.post('/ui/project/open', (req, res) => {
  handleOpenFold(req.body).then((result) => res.json(sendData(result)))
})

routerProject.get('/ui/project/path', (req, res) => {
  res.json(sendData(handleGetPath(req.query)))
})

routerProject.get('/ui/project/disc', (_, res) => {
  handleGetDisc().then((result) => res.json(sendData(result)))
})

routerProject.get('/ui/project/select', (req, res) => {
  handleGetTemplateInfo(req.query).then((result) => res.json(sendData(result)))
})

routerProject.post('/ui/project/create', (req, res) => {
  handleCreateProject(req.body)
    .then((result) => res.json(sendData(result)))
    .catch((err) => res.json(sendData(null, err)))
})

module.exports = routerProject
