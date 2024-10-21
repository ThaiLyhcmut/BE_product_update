const express = require("express")
const controller = require("../../controllers/client/chat_controller")
const router = express.Router()


// đường dẫn con
router.get("/", controller.index)



// exports các đường dẫn con
module.exports = router