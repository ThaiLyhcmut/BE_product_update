const User = require("../../models/user_model")
const md5 = require("md5")
const generateHelper = require("../../helper/generate_helper")
module.exports.register = (req, res) => {
  res.render("client/pages/user/register")
}

module.exports.registerPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  })
  if (user){
    res.json({
      "code": "user da ton tai"
    })
    res.redirec("back")
    return
  }
  const dataUser = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password),
    token: generateHelper.generateRandomString(30),
    status: "active"
  }
  const newUser = new User(dataUser)
  await newUser.save()
  res.cookie("tokenUser", newUser.token);
  res.redirect("/");
}


module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    Pagetitle: "trang dang nhap"
  })
}


module.exports.loginPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false
  })
  if(!user){
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  console.log(md5(req.body.password), user.password)
  if(md5(req.body.password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }
  if(user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", user.token);
  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/")
}


module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success", "Đã đăng xuất!");
  res.redirect("/");
};