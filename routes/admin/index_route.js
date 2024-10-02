const dashboarhRoute = require("./dashboarh_route")
const productRouter = require("./product_route")
const productCategogyRouter = require("./product-category_route")
const roleRoute = require("./role_route")
const accountRoute = require("./account_route")
const authRoute = require("./auth_route");
const PATH_ADMIN = require("../../config/system").prefixAdmin
const authMiddleware = require("../../middlewares/admin/auth").requireAuth;

module.exports = (app) => {
  // xử dụng router để dẫn đến các đường dẫn con
  // app.use("/", dashboarhRoute)
  app.use(`${PATH_ADMIN}/dashboarh`,authMiddleware, dashboarhRoute)
  app.use(`${PATH_ADMIN}/products`,authMiddleware, productRouter)
  app.use(`${PATH_ADMIN}/products-category`,authMiddleware, productCategogyRouter)
  app.use(`${PATH_ADMIN}/roles`,authMiddleware, roleRoute)
  app.use(`${PATH_ADMIN}/account`,authMiddleware, accountRoute)
  app.use(`${PATH_ADMIN}/auth`, authRoute);
  // xử dụng router để dẫn đến các đường dẫn con
  
}