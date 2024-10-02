const express = require("express")
const router = express.Router()

const dashboarh_controller = require("../../controllers/admin/dashboarh_controller")

router.get("/", dashboarh_controller.index)

module.exports = router

