const express = require("express")
const controller = require("../../controllers/client/order_controller")
const router = express.Router()


router.get("/", controller.index)
router.get("/success/:id", controller.success)
router.post("/", controller.indexPost)

module.exports = router