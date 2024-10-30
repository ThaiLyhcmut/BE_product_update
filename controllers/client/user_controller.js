const User = require("../../models/user_model")
const md5 = require("md5")
const generateHelper = require("../../helper/generate_helper")
const sendMailHelper = require("../../helper/sendMail_helper")
const ForgotPassword = require("../../models/forgot-password")
const UserSocket = require("../../sockets/client/user_socket")
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


module.exports.forgotPassword = (req, res) => {
  res.render("client/pages/user/forgot-password", {
    Pagetitle: "Lay lai mat khau"
  })
}


module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email
  const exisUser = await User.findOne({
    email: email,
    status: "active",
    deleted: false
  })
  if(!exisUser){
    req.flash("error", "Email khong ton tai")
    res.redirect("back")
    return;
  }
  const exisEmail = await ForgotPassword.findOne({
    email: email
  })
  if(exisEmail){
    req.flash("error", "OTP da duoc gui truoc do")
    res.redirect(`/user/password/otp?email=${email}`)
    return;
  }
  const otp = generateHelper.generateRandomNumber(6)
  const data = {
    email: email,
    otp: otp
  }
  const record = new ForgotPassword(data)
  await record.save()
  const subject = "Xac thuc ma OTP"
  const text = `Ma xac thuc cua ban la <b>${otp}</b>. Ma OTP co hieu luc trong 5 phut. Vui long khong cung cap ma OTP cho bat ky ai`
  sendMailHelper.sendMail(email, subject, text)
  req.flash("success", "OTP da gui va ton tai trong vong 60 giay")
  res.redirect(`/user/password/otp?email=${email}`)
}


module.exports.otpPassword = (req, res) => {
  const email = req.query.email
  res.render("client/pages/user/otp-password", {
    Pagetitle: "Xac thuc otp",
    email: email
  })
}

module.exports.otpPasswordPost = async (req, res) => {
  const exisRecord = await ForgotPassword.findOne(req.body)
  if(!exisRecord){
    req.flash("error", "Ma OTP khong hop le")
    res.redirect("back")
    return
  }
  const user = await User.findOne({
    email: req.body.email
  })
  await ForgotPassword.deleteOne({
    email: req.body.email
  })
  res.cookie("tokenUser", user.token)
  res.redirect("/user/password/reset")
}

module.exports.reset = (req, res) => {
  res.render("client/pages/user/reset", {
    Pagetitle: "Doi mat khau"
  })
}
module.exports.resetPost = async (req, res) => {
  const tokenUser = req.cookies.tokenUser
  await User.updateOne({
    token: tokenUser,
    status: "active",
    deleted: false
  }, {
    password: md5(req.body.password)
  })
  req.flash("success", "doi mat khau thanh cong")
  res.redirect("/")
}

module.exports.notFriend = async (req, res) => {
  UserSocket(req, res)
  const userIdA = res.locals.user.id
  const users = await User.find({
    $and: [
      {
        _id: {
          $ne: userIdA
        }
      }, {
        _id: {
          $nin: res.locals.user.acceptFriends
        }
      },{
        _id: {
          $nin: res.locals.user.requestFriends
        }
      },{
        _id: {
          $nin: res.locals.user.FriendList.map(item => item.userId)
        }
      }
    ],
    deleted: false,
    status: "active"
  }).select("fullName avatar id")
  res.render("client/pages/user/not-friend", {
    Pagetitle: "Dang sach nguoi dung",
    users: users
  })
}

module.exports.request = async (req, res) => {
  UserSocket(req, res)
  const users = await User.find({
    _id:{
      $in :res.locals.user.requestFriends
    },
    deleted: false,
    status: "active"
  }).select("fullName avatar id")
  res.render("client/pages/user/request", {
    Pagetitle: "Dang sach loi moi da gui",
    users: users
  })
}

module.exports.accept = async (req, res) => {
  UserSocket(req, res)
  const users = await User.find({
    _id:{
      $in :res.locals.user.acceptFriends
    },
    deleted: false,
    status: "active"
  }).select("fullName avatar id")
  res.render("client/pages/user/accept", {
    Pagetitle: "Dang sach loi moi da nhan",
    users: users
  })
}

module.exports.friend = async (req, res) => {
  const users = await User.find({
    _id:{
      $in :res.locals.user.FriendList.map(item => item.userId)
    },
    deleted: false,
    status: "active"
  }).select("fullName avatar id")
  res.render("client/pages/user/friends", {
    Pagetitle: "Dang sach loi moi da nhan",
    users: users
  })
}

