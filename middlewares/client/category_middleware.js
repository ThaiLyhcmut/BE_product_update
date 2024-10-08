const ProductCategory = require("../../models/product-category")
const createTree = require("../../helper/createtree_helper")
module.exports.category = async (req, res, next) => {
  const category_product = await ProductCategory.find({
    deleted: false,
    status: "active"
  })
  const allCategory = createTree.getAllcategory(category_product)
  res.locals.allCategory = allCategory;
  next();
}