const { productTree } = require("../../helper/createtree_helper")
const ProductCategory = require("../../models/product-category")
const Product = require("../../models/product_model")

module.exports.index = async (req,res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({
    position: "asc"
  })
  res.render("client/pages/products/index", {
    Pagetitle: "Trang danh sach san pham",
    products: products
  })
  // res.json(products)
}

module.exports.detail = async (req, res) => {
  const slug = req.params.slug
  const product = await Product.findOne({
    slug: slug,
    status: "active",
    deleted: false
  })
  console.log(product)
  res.render("client/pages/products/detail", {
    Pagetitle: "Trang chi tiet san pham",
    product: product
  })
}


module.exports.category = async (req, res) => {
  const categoryData = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
    status: "active"
  })
  const product = await Product.find({
    category_id: categoryData.id,
    deleted: false,
    status: "active"
  })
  product.forEach(item => {
    item.priceNew = ((1-item.discountPercentage/100) * item.price).toFixed(2)
  })
  res.render("client/pages/products/index", {
    products: product
  })
}