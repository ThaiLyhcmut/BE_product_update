const ProductCategory = require("../../models/product-category")
const systemConfig = require("../../config/system")
module.exports.index = async (req, res) => {
  if(!res.locals.role.permissions.includes("products-category_view")){
    return
  }
  const listCategory = await ProductCategory.find({
    deleted: false
  })
  res.render("admin/pages/product-category/index", {
    Pagetitle: "Danh sach danh muc san pham",
    listCategory: listCategory
  })
}

module.exports.create = async (req, res) => {
  if(!res.locals.role.permissions.includes("products-category_create")){
    return
  }
  const listCategory = await ProductCategory.find({
    deleted: false
  })
  res.render("admin/pages/product-category/create", {
    Pagetitle: "Tao danh muc san pham",
    listCategory: listCategory
  })
}


module.exports.createPost = async (req, res) => {
  if(!res.locals.role.permissions.includes("products-category_create")){
    return
  }
  if(!req.body.position){
    const countRecord = await ProductCategory.countDocuments();
    req.body.position = countRecord + 1
  }
  req.body.position = parseInt(req.body.position)

  console.log(req.body)

  const record = new ProductCategory(req.body)
  await record.save()

  res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

module.exports.edit = async (req, res) => {
  const id = req.params.id
  const [category] = await ProductCategory.find({
    _id: id,
    deleted: false
  })
  const listCategory = await ProductCategory.find({
    deleted: false
  })
  res.render("admin/pages/product-category/edit", {
    Pagetitle: "Chinh sua danh muc san pham",
    category: category,
    listCategory: listCategory
  })
}


module.exports.editPatch = async (req, res) => {
  if(!res.locals.role.permissions.includes("products-category_edit")){
    return
  }
  const id = req.params.id
  if(req.body.position){
    req.body.position = parseInt(req.body.position)
  }else{
    delete req.body.position
  }

  console.log(req.body)
  await ProductCategory.updateOne({
    _id: id,
    deleted: false
  }, req.body)
  req.flash("success", "cap nhat thanh cong")
  res.redirect(`back`)
}
