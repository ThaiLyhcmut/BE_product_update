const express = require("express");
const product_controller = require("../../controllers/admin/product_controller");
const router = express.Router();
const multer = require("multer");
const validates = require("../../validates/admin/product_validate");

const { uploadSingle } = require("../../middlewares/admin/uploadCloud");


// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './public/uploads/');
//   },
//   filename: function(req, file, cb) {
//     const fileName = `${Date.now()} - ${file.originalname}`
//     cb(null, fileName);
//   },
// });

// const upload = multer({ storage: storage });

const upload = multer();

// đường dẫn con
router.get("/", product_controller.index);
router.get("/create", product_controller.create);
router.get("/detail/:id", product_controller.detail);
router.get("/edit/:id", product_controller.edit);
router.get("/trash", product_controller.trash)

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadSingle,
  validates.createProduct,
  product_controller.createPost
);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadSingle,
  validates.createProduct,
  product_controller.editPatch
);
router.patch("/change", product_controller.changeStatus);
router.patch("/change-multi", product_controller.changeMulti);
router.patch("/delete", product_controller.delete);
router.patch("/change-position", product_controller.changePosition);
router.patch("/trashChange", product_controller.trashChange)
router.delete("/trash", product_controller.trashDelete)
// exports các đường dẫn con
module.exports = router;
