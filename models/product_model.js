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
  createAt: Date,
  updateAt: Date,
  createBy: String,
  updateBy: String,
  featured: {
    type: String,
    default: "0"
  },
  deleted: Boolean
})


const Product = mongoose.model(
  'Product',
  ProductScheme,
  'products'
)


module.exports = Product