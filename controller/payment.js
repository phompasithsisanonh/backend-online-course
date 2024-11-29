const Cart = require("../models/Foruser/cart");
const Payment = require("../models/Foruser/payment");
const payment = async (req, res, next) => {
  const { cart_id, cart_course, typePayment, statusAccess, email, tel, address } = req.body;
  try {
    const cart = await Cart.findById(req.params._id).populate("items");
    console.log(cart)
    if (req.user._id || typePayment || statusAccess) {
      const payment = new Payment({
        user: req.user._id,
        cart: cart,
        cart_course: {
          _id:cart.items._id,
          admin: cart.items.admin,
          categories: cart.items.categories,
          courses: cart.items.courses,
        },
        typePayment: typePayment,
        statusAccess: statusAccess,
        email: email,
        tel: tel,
        address: tel,
        cart_id: cart_id,
      });
      await payment.save();
      //   const populatedPayment = await Payment.findById(payment._id).populate('membership_courses');
      return res.status(201).json({
        success: true,
        message: "ຊຳລະເງິນສຳເລັດ ລໍຖ້າອະນຸມັດ 15-30 ນາທີ",
        payment,
      });
    } else {
      res.status(404).json({ message: "you not have ID" });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.payment = payment;
