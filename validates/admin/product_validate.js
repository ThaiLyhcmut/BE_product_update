module.exports.createProduct = async (req, res, next) => {
  if(!req.body.title){
    req.flash("danger", "Tieu de khong duoc de trong")
    res.redirect("back")
    return ;
  }
  next()
}