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