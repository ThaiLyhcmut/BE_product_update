const Product = require("../../models/product_model")
const systemConfig = require("../../config/system")
const ProductCategory = require("../../models/product-category")
module.exports.index = async (req,res) => {
  const find = {
    deleted: false,
  }

  if(req.query.status) {
    find.status = req.query.status
  }
  if(req.query.keyword) {

    const regex = new RegExp(req.query.keyword, "i")
    find.title = regex
  }

  let limitItems = 4;
  let page = 1;
  if(req.query.page){
    page = parseInt(req.query.page)
  }
  if(req.query.limit){
    limitItems = parseInt(req.query.limitItems)
  }
  const skip = (page - 1)*limitItems

  const products = await Product.find(find).limit(limitItems).skip(skip).sort({position: 1})
  const total_products = await Product.countDocuments(find)
  const total_page = parseInt((total_products + limitItems - 1)/limitItems)
  res.render("admin/pages/products/index", {
    Pagetitle: "Trang danh sach san pham",
    products: products,
    total_page: total_page,
    currentPage: page
  })
  // res.json({
  //   products: products,
  //   total_page: total_page,
  //   Pagetitle: "Trang danh sach san pham"
  // })
}

module.exports.changeStatus = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    status: req.body.status
  })
  req.flash('Success', "doi trang thai thanh cong")
  res.json({
    code: "Success",
  })
}

module.exports.changeMulti = async (req, res) => {

  switch(req.body.status){
    case "delete":
      await Product.updateMany({
        _id: req.body.id,
      }, {
        deleted: true
      })
      break;
    case "redelete":
      await Product.updateMany({
        _id: req.body.id
      },{
        deleted: false
      })
    case "permanently delete":
      await Product.deleteMany({
        _id: req.body.id
      })
      break;
    default:
      await Product.updateMany({
        _id: req.body.id
      }, {
        status: req.body.status
      })
  }
  res.json({
    code: "Success",
    massage: "Doi Trang Thai Thanh Cong"
  })
}

module.exports.delete = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    deleted: true
  })
  res.json({
    code: "Success",
    massage: "Doi Trang Thai Thanh Cong"
  })
}

module.exports.changePosition = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    position: parseInt(req.body.position)
  })

  res.json({
    code: "Success",
    massage: "Doi Trang Thai Thanh Cong"
  })
}

module.exports.create = async (req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false
  })
  res.render("admin/pages/products/create", {
    Pagetitle: "Trang them moi san pham",
    listCategory: listCategory
  })
}
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  if(!req.body.deleted){
    req.body.deleted = "false"
  }
  if(!req.body.position){
    const countRecord = await Product.countDocuments();
    req.body.position = countRecord + 1
  }
  req.body.position = parseInt(req.body.position)
  const record = new Product(req.body)
  await record.save()
  res.redirect(`${systemConfig.prefixAdmin}/products`)
}

module.exports.edit = async (req, res) => {
  const id = req.params.id
  const productDetail = await Product.findOne({
    _id: id,
    deleted: false
  })
  const listCategory = await ProductCategory.find({
    deleted: false
  })
  res.render("admin/pages/products/edit", {
    PageTitle: "Chinh sua san pham",
    productDetail: productDetail,
    listCategory: listCategory
  })
}

module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  req.body.position = parseInt(req.body.position)
  console.log(req.body)
  const id = req.params.id
  await Product.updateOne({
    _id: id,
    deleted: false
  }, req.body)
  req.flash("Success", "Cap nhat thanh cong")
  res.redirect("back")
}

module.exports.detail = async (req, res) => {
  const id = req.params.id
  const productDetail = await Product.findOne({
    _id: id,
    deleted: false
  })
  res.render("admin/pages/products/detail", {
    PageTitle: "chi tiet san pham",
    product: productDetail
  })
}


module.exports.trash = async(req, res) => {
  const products = await Product.find({
    deleted: true
  })
  res.render("admin/pages/products/trash",{
    Pagetitle: "San pham da xoa",
    products: products
  })
}

module.exports.trashDelete = async(req, res) => {
  const id = req.body.id
  console.log(req.body)
  await Product.deleteOne({
    _id: id
  })
  res.json({
    code: "Success"
  })
}

module.exports.trashChange = async (req, res) => {
  const id = req.body.id
  await Product.updateOne({
    _id: id
  }, {
    deleted: false
  })
  res.json({
    code: "Success"
  })
}

