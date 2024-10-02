const productRouter = require("./product_route")
const homeRouter = require("./home_route")
module.exports = (app) => {
  // xử dụng router để dẫn đến các đường dẫn con
  app.use("/", homeRouter)
  app.use("/products", productRouter)
  // xử dụng router để dẫn đến các đường dẫn con
  
}