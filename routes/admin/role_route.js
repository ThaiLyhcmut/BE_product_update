const express = require("express")
const router = express.Router()
const controller = require("../../controllers/admin/role_controller")

router.get("/", controller.index)
router.get("/create", controller.create)
router.get("/edit/:id", controller.edit)
router.get("/permissions", controller.permissions)

router.patch("/edit/:id", controller.editPatch)
router.patch("/permissions", controller.permissionsPatch)

router.post("/create", controller.createPost)


module.exports = router