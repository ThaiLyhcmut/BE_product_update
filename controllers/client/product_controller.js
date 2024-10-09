const ProductCategory = require("../../models/product-category")
const Product = require("../../models/product_model")

module.exports.index = async (req,res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({
    position: "asc"
  })
  res.render("client/pages/products/index", {
    Pagetitle: "Trang danh sach san pham",
    products: products
  })
  // res.json(products)
}

module.exports.detail = async (req, res) => {
  const slug = req.params.slug
  const product = await Product.findOne({
    slug: slug,
    status: "active",
    deleted: false
  })
  if(product.category_id) {
    const category = await ProductCategory.findOne({
      _id: product.category_id,
      deleted: false,
      status: "active"
    });
    product.category = category;
  }
  product.priceNew = product.price*(100 - product.discountPercentage)/100;
  product.priceNew = (product.priceNew).toFixed(0);
  res.render("client/pages/products/detail", {
    Pagetitle: "Trang chi tiet san pham",
    product: product
  })
}


module.exports.category = async (req, res) => {
  const categoryData = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
    status: "active"
  })

  const allCategoryChildren = []
  const getCategoryChildren = async (parentId) => {
    if (parentId){
      allCategoryChildren.push(parentId)
    }
    const childs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false
    })
    for (const item of childs){
      getCategoryChildren(item.id)
    }
    
  }
  await getCategoryChildren(categoryData.id)
  const product = await Product.find({
    category_id: { $in: allCategoryChildren},
    deleted: false,
    status: "active"
  })
  product.forEach(item => {
    item.priceNew = ((1-item.discountPercentage/100) * item.price).toFixed(2)
  })
  res.render("client/pages/products/index", {
    products: product
  })
}

module.exports.search = async (req, res) => {
  const keyword = req.query.keyword
  let products = [];
  if(keyword){
    const regex = new RegExp(keyword, "i");

    products = await Product
      .find({
        title: regex,
        deleted: false,
        status: "active"
      })
      .sort({ position: "desc" });
    for (const item of products) {
      item.priceNew = (1 - item.discountPercentage/100) * item.price;
      item.priceNew = item.priceNew.toFixed(0);
    }
  }
  res.render("client/pages/products/search", {
    Pagetitle: `Ket qua tim kiem ${keyword}`,
    keyword: keyword,
    products: products
  })
}