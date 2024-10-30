const express = require("express")
const controller = require("../../controllers/client/chat_controller")
const router = express.Router()
const middleware = require("../../middlewares/client/chat_middleware")

// đường dẫn con
router.get("/:id", middleware.isAccept, controller.index)


// exports các đường dẫn con
module.exports = router