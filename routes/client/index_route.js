const productRouter = require("./product_route")
const homeRouter = require("./home_route")
const cartRouter = require("./cart_route")
const orderRouter = require("./order_route")
const category_middleware = require("../../middlewares/client/category_middleware")
const { cart } = require("../../middlewares/client/cart_middleware")
module.exports = (app) => {
  // xử dụng router để dẫn đến các đường dẫn con
  app.use(cart)
  app.use(category_middleware.category)
  app.use("/", homeRouter)
  app.use("/products", productRouter)
  app.use("/cart", cartRouter)
  app.use("/order", orderRouter)
  // xử dụng router để dẫn đến các đường dẫn con
  
}