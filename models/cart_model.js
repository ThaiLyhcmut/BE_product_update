const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({
  products: Array,
  expireAt: {
    type: Date,
    expires: 0
  }
}, {
  timeseries: true
})

const Cart = mongoose.model("Cart", CartSchema, "carts")
module.exports = Cart