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

CartSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });


const Cart = mongoose.model("Cart", CartSchema, "carts")
module.exports = Cart