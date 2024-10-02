const Account = require("../../models/account_model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
module.exports.login = (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập"
  });
}
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await Account.findOne({
    email: email,
    deleted: false
  });
  if(!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  if(md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }
  if(user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboarh`);
}

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}