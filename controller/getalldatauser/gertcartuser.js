const Cartuser = require("../../models/Foruser/cart");
const Payment = require("../../models/Foruser/payment");
const History = require("../../models/Foruser/historycourses");
const mongoose = require('mongoose');
const getcartuser = async (req, res) => {
  try {
    // Count documents for the user
    const cartCount = await Cartuser.countDocuments({ user: req.user._id });

    // Fetch the cart items for the user
    const cartList = await Cartuser.find({ user: req.user._id }).populate(
      "items"
    );

    // Return the cart count and list in a proper JSON response
    return res.status(200).json({
      success: true,
      cartCount: cartCount,
      cartList: cartList,
    });
  } catch (err) {
    console.log(err);

    // Return error response
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
const getpaymentdata = async (req, res) => {
  try {
    const getpayment = await Payment.findOne({ user: req.user._id });
    res.status(200).json({
      success: true,
      getpayment,
    });
  } catch (error) {
    console.log(error);
  }
};
const getIdPaymentId = async (req, res) => {
  try {
    // Fetch all Cartuser entries for the specified user
    const cartUsers = await Cartuser.findOne({ _id: req.params._id })
      .populate("user")
      .populate("items");

    // Ensure at least one Cartuser is found
    if (!cartUsers || cartUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart user not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        cart_id: cartUsers,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const gethistory = async (req, res) => {
  try {
    const userRecord = await History.findOne({ user: req.params._id}).populate("historycourseforpayment.cart");
    const userRecord_more = await History.find({ user: req.params._id}).populate("historycourseforpayment.cart");

    return userRecord
      ? res.status(200).json({userRecord ,userRecord_more})
      : res.status(404).json({ message: 'User not found in history records' });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.getcartuser = getcartuser;
module.exports.getpaymentdata = getpaymentdata;
module.exports.getIdPaymentId = getIdPaymentId;
module.exports.gethistory = gethistory;
