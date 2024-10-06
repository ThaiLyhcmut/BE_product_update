const express = require("express")
const router = express.Router()
const controller = require("../../controllers/admin/account")
const multer = require("multer")

const upload = multer()
const {uploadSingle} = require("../../middlewares/admin/uploadCloud")

router.get("/", controller.index)
router.get("/create", controller.create)
router.get("/edit/:id", controller.edit)
router.get("/myprofile", controller.myprofile)
router.get("/change-password/:id", controller.changePassword)
router.patch("/edit/:id",upload.single('avatar'),uploadSingle, controller.editPatch)
router.patch("/change-password/:id", controller.changePasswordPost)

router.post("/create", upload.single('avatar'),uploadSingle, controller.createPost)


module.exports = router