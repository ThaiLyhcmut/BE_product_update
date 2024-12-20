const Cart = require("../../models/cart_model");

module.exports.cart = async (req, res, next) => {
  try {
    if (!req.cookies.cartId) {
      const expiresDay = 365 * 24 * 60 * 60 * 1000;
      const cart = new Cart({
        expireAt: Date.now() + expiresDay,
        products: [] // Initialize products as an empty array
      });
      await cart.save();
      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresDay)
      });
      res.locals.miniCart = cart.products.length; // Safe access here
    } else {
      const cart = await Cart.findOne({
        _id: req.cookies.cartId
      });

      if (cart && cart.products) { // Check if cart is not null and has products
        res.locals.miniCart = cart.products.length;
      } else {
        res.locals.miniCart = 0; // If cart is null or doesn't have products, set length to 0
      }
    }
    next();
  } catch (error) {
    console.error("Error in cart middleware:", error);
    res.status(500).send("Internal Server Error"); // Handle error appropriately
  }
};
