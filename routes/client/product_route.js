const express = require("express")
const product_controller = require("../../controllers/client/product_controller")
const router = express.Router()

// đường dẫn con
router.get("/", product_controller.index)
router.get("/detail/:slug", product_controller.detail)
router.get("/:slugCategory", product_controller.category)

// exports các đường dẫn con
module.exports = router