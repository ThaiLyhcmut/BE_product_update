const md5 = require("md5")
const Role = require("../../models/role_model")
const generate = require("../../helper/generate_helper")
const Account = require("../../models/account_model")
const systemConfig = require("../../config/system")

module.exports.index = async (req, res) => {
  if(!res.locals.role.permissions.includes("roles_account_view")){
    return
  }
  const records = await Account.find({
    deleted: false
  })
  for (const item of records){
    const role = await Role.findOne({
      _id: item.role_id,
      deleted: false
    })
    item.role_title = role.title
  }
  res.render("admin/pages/account/index", {
    Pagetitle: "Trang tai khoan",
    records: records
  })
}

module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  })
  res.render("admin/pages/account/create", {
    Pagetitle: "Trang tao moi san pham",
    roles: roles
  })
}

module.exports.createPost = async (req, res) => {
  if(!res.locals.role.permissions.includes("roles_account_edit")){
    return ;
  }
  req.body.password = md5(req.body.password)
  req.body.token = generate.generateRandomString(30)
  const account = new Account(req.body)
  await account.save()
  res.redirect(`${systemConfig.prefixAdmin}/account`)
}

module.exports.edit = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  })
  const account = await Account.findOne({
    _id: req.params.id,
    deleted: false
  })
  res.render("admin/pages/account/edit", {
    Pagetitle: "Trang chinh sua san pham",
    roles: roles,
    account: account
  })
}

module.exports.editPatch = async (req, res) => {
  if(!res.locals.role.permissions.includes("roles_account_view")){
    return
  }
  await Account.updateOne({
    _id: req.params.id,
    deleted: false
  },req.body)
  res.redirect('back')
}


module.exports.changePassword = async (req, res) => {
  const account = await Account({
    _id: req.params.id,
    deleted: false
  })
  res.render("admin/pages/account/change-password", {
    account: account,
    Pagetitle: "Trang doi MK"
  })
}

module.exports.changePasswordPost = async (req, res) => {
  if(!res.locals.role.permissions.includes("roles_account_view")){
    return
  }
  req.body.password = md5(req.body.password)
  account = await Account.updateOne({
    _id: req.params.id
  },req.body)
  res.redirect(`${systemConfig.prefixAdmin}/account`)
}

module.exports.myprofile = async (req, res) => {
  if(!res.locals.user){
    return 
  }
  res.render("admin/pages/account/myprofile", {
    Pagetitle: "Thong tin ca nhan",
  })
}