const express = require("express")
const controller = require("../../controllers/client/cart_controller")
const router = express.Router()


// đường dẫn con
router.get("/", controller.index)

router.get("/delete/:id", controller.deleted)

router.patch("/update", controller.update)

router.post("/add/:id", controller.addPost)


// exports các đường dẫn con
module.exports = router