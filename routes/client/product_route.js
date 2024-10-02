const express = require("express")
const product_controller = require("../../controllers/client/product_controller")
const router = express.Router()

// đường dẫn con
router.get("/", product_controller.index)
router.get("/detail/:slug", product_controller.detail)

// exports các đường dẫn con
module.exports = router