const express = require("express")
const router = express.Router()

// up anh len Cloud
const multer = require("multer")
const uploadCloud = require("../../middlewares/admin/uploadCloud")
const upload = multer()

const product_category_controller = require("../../controllers/admin/product_category_controller")

router.get("/", product_category_controller.index)
router.get("/create", product_category_controller.create)
router.get("/edit/:id", product_category_controller.edit)
router.post("/create", upload.single('thumbnail'), uploadCloud.uploadSingle, product_category_controller.createPost)
router.patch("/edit/:id", upload.single("thumbnail"), uploadCloud.uploadSingle, product_category_controller.editPatch)

module.exports = router

