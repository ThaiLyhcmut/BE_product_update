const Role = require("../../models/role_model")
const systemConfig = require("../../config/system")
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false
  })
  res.render("admin/pages/role/index", {
    Pagetitle: "nhom quyen",
    records: records
  })
}

module.exports.create = async (req, res) => {
  res.render("admin/pages/role/create", {
    Pagetitle: "them nhom quyen",
  })
}

module.exports.createPost = async (req, res) => {
  const role = new Role(req.body)
  await role.save()
  
  res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

module.exports.edit = async (req, res) => {
  const id = req.params.id
  const role = await Role.findOne({
    _id: id,
    deleted: false
  })
  res.render("admin/pages/role/edit", {
    Pagetitle: "chinh sua nhom quyen",
    role: role
  })
}

module.exports.editPatch = async (req, res) => {
  const id = req.params.id
  await Role.updateOne({
    _id: id,
    deleted: false
  }, req.body)
  req.flash("Success", "cap nhat thanh cong")
  res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

module.exports.permissions = async (req, res) => {
  const records = await Role.find({
    deleted: false
  })
  res.render("admin/pages/role/permissions", {
    Pagetitle: "Trang phan quyen",
    records: records
  })
}

module.exports.permissionsPatch = async (req, res) => {
  console.log(req.body)
  req.body.forEach(async item => {
    await Role.updateOne({
      _id: item.id
    },{
      permissions: item.permissions
    })
  })
  req.flash("Success", "cap nhat thanh cong")
  res.json({
    code: "Success"
  })
}