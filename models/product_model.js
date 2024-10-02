const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const ProductScheme = new mongoose.Schema({
  category_id: String,
  title: String,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: Boolean
})


const Product = mongoose.model(
  'Product',
  ProductScheme,
  'products'
)


module.exports = Product