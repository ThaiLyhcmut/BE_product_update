const express = require("express")
const router = express.Router()
const controller = require("../../controllers/admin/account")
const multer = require("multer")

const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloud")

router.get("/", controller.index)
router.get("/create", upload.single('avatar'), uploadCloud.uploadSingle, controller.create)
router.post("/create", controller.createPost)

module.exports = router