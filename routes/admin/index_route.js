const dashboarhRoute = require("./dashboarh_route")
const productRouter = require("./product_route")
const productCategogyRouter = require("./product-category_route")
const roleRoute = require("./role_route")
const accountRoute = require("./account_route")
const PATH_ADMIN = require("../../config/system").prefixAdmin

module.exports = (app) => {
  // xử dụng router để dẫn đến các đường dẫn con
  // app.use("/", dashboarhRoute)
  app.use(`${PATH_ADMIN}/dashboarh`, dashboarhRoute)
  app.use(`${PATH_ADMIN}/products`, productRouter)
  app.use(`${PATH_ADMIN}/products-category`, productCategogyRouter)
  app.use(`${PATH_ADMIN}/roles`, roleRoute)
  app.use(`${PATH_ADMIN}/account`, accountRoute)
  // xử dụng router để dẫn đến các đường dẫn con
  
}