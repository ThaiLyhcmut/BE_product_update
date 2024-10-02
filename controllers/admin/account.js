const md5 = require("md5")
const Role = require("../../models/role_model")
const generate = require("../../helper/generate_helper")
const Account = require("../../models/account_model")
const systemConfig = require("../../config/system")

module.exports.index = async (req, res) => {
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
  req.body.password = md5(req.body.password)
  req.body.token = generate.generateRandomString(30)
  const account = new Account(req.body)
  await account.save()
  res.redirect(`${systemConfig.prefixAdmin}/account`)
}