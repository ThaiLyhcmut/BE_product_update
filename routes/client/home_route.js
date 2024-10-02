const express = require("express")
const home_controller = require("../../controllers/client/home_controller")
const router = express.Router()


// đường dẫn con
router.get("/", home_controller.index)


// exports các đường dẫn con
module.exports = router