const productRouter = require("./product_route")
const homeRouter = require("./home_route")
const category_middleware = require("../../middlewares/client/category_middleware")
module.exports = (app) => {
  // xử dụng router để dẫn đến các đường dẫn con
  app.use(category_middleware.category)
  app.use("/", homeRouter)
  app.use("/products", productRouter)
  // xử dụng router để dẫn đến các đường dẫn con
  
}