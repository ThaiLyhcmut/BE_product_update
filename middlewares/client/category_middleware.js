const ProductCategory = require("../../models/product-category")
module.exports.category = async (req, res, next) => {
  const category_product = await ProductCategory.find({
    deleted: false,
    status: "active"
  })
  console.log(category_product)
  next();
}