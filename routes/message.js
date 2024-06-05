const express = require('express')
const route = express.Router();
const message = require("../controller/message")
const userauthenticate = require('../middleware/auth')

route.post("/add-message", userauthenticate.authenticate, message.addMessage)
route.get("/get-messages", message.getMessages)
route.post("/addToGroup", message.addToGroup)
route.get("/getuser", userauthenticate.authenticate, message.getuser)
route.get("/allusers", message.allusers)
route.post("/removeMember", message.removeMember)
route.post("/addAdmin", message.addAdmin)

module.exports = route