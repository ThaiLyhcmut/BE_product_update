const Cart = require("../../models/cart_model")
const Product = require("../../models/product_model")

module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId
  const cart = await Cart.findOne({
    _id: cartId
  })
  const products = cart.products
  const exitsProduct = products.find(item => item.productID == req.params.id)
  if(exitsProduct){
    exitsProduct.quantity = exitsProduct.quantity + parseInt(req.body.quantity)
  }
  else{
    const product = {
      productID: req.params.id,
      quantity: parseInt(req.body.quantity)
    }
    products.push(product);
  }
  await Cart.updateOne({
    _id: cartId,
  }, {
    products: products
  })
  res.redirect("back");
}

module.exports.index  = async (req, res) => {
  const cart = await Cart.findOne({
    _id: req.cookies.cartId
  })
  let total = 0;
  for (const item of cart.products) {
    const product = await Product.findOne({
      _id: item.productID
    })
    item.thumbnail = product.thumbnail
    item.priceNew = ((1 - product.discountPercentage/100)*(product.price)).toFixed(2)
    item.slug = product.slug
    item.title = product.title
    item.total = item.priceNew*item.quantity
    total = total + item.total
  };
  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    products: cart.products,
    total: total
  });
}

module.exports.deleted = async (req, res) => {
  const productID = req.params.id
  const cartId = req.cookies.cartId
  const cart = await Cart.findOne({
    _id: cartId
  })
  const products = (cart.products).filter(item => item.productID != productID)
  await Cart.updateOne({
    _id: cartId
  }, {
    products: products
  })
  res.redirect("back")
}


module.exports.update = async (req, res) => {
  const product = req.body
  const cartId = req.cookies.cartId
  const cart = await Cart.findOne({
    _id: cartId
  })
  const ProductUpdate = (cart.products).find(item => item.productID == product.productID)
  ProductUpdate.quantity = parseInt(product.quantity)
  await Cart.updateOne({
    _id: cartId
  }, {
    products: cart.products
  })
  res.json({
    code: "Success",
    massage: "Cap nhat thanh cong"
  })
}