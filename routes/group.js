const express = require('express')
const route = express.Router();
const group = require("../controllers/group")
const userauthenticate = require('../middleware/auth')

route.post("/addgroup", userauthenticate.authenticate, group.addgroup)
route.get("/getname", userauthenticate.authenticate, group.getgroups)

module.exports = route