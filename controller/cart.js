const Cart = require("../models/Foruser/cart");
const Course = require("../models/Foradmin/course");
const mongoose = require("mongoose");
const cart = async (req, res, next) => {
  try {
    // const { items } = req.body;
    const items = req.params._id;
    // Map item IDs to an array of promises to check if each exists in the database
    // const existingItems = await Promise.all(
    //   items.map((item) => Cart.findOne({ "items.id": item.id }))
    // );

    // // Filter out items that already exist
    // const newItems = items.filter((item, index) => !existingItems[index]);

    // Check if the course exists in the Course collection

    if (items.length === 0) {
      // If all items already exist, return a message indicating this
      return res.status(200).json({
        success: true,
        message: "All items are already in the cart",
      });
    }
    const cart = new Cart({
      user: req.user._id,
      items: items,
    });
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "New items added to cart successfully",
      cart,
    });

    // Create or add the new items to the cart document
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports.cart = cart;
