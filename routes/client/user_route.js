const express = require("express")
const router = express.Router()
const controller = require("../../controllers/client/user_controller")
const middleware = require("../../middlewares/client/user_middleware")
router.get("/register", controller.register)
router.post("/register", controller.registerPost)
router.get("/login", controller.login)
router.post("/login", controller.loginPost)
router.get("/logout", controller.logout)
router.get("/password/forgot", controller.forgotPassword)
router.post("/password/forgot", controller.forgotPasswordPost)
router.get("/password/otp", controller.otpPassword)
router.post("/password/otp", controller.otpPasswordPost)
router.get("/password/reset", controller.reset)
router.post("/password/reset", controller.resetPost)

router.get(
  "/not-friend",
  middleware.requireAuth,
  controller.notFriend
)
module.exports = router