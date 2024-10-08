const Product = require("../../models/product_model")

module.exports.index = async (req, res) => {
  const productFeatured = await Product.find({
    deleted: false,
    status: "active",
    featured: "1"
  }).sort({
    position: 1
  }).limit(6)
  productFeatured.forEach(item => {
    item.priceNew = ((1 - item.discountPercentage/100)*item.price).toFixed(0)
  })
  const productNew = await Product.find({
    deleted: false,
    status: "active"
  }).sort({
    position: 1
  }).limit(6)
  productNew.forEach(item => {
    item.priceNew = ((1 - item.discountPercentage/100)*item.price).toFixed(0)
  })
  const productDiscount = await Product.find({
    deleted: false,
    status: "active"
  }).sort({
    discountPercentage: -1
  }).limit(6)
  productDiscount.forEach(item => {
    item.priceNew = ((1 - item.discountPercentage/100)*item.price).toFixed(0)
  })
  console.log(productFeatured)
  res.render("client/pages/home/index", {
    Pagetitle: "Trang chu",
    productFeatured: productFeatured,
    productNew: productNew,
    productDiscount: productDiscount
  })
}