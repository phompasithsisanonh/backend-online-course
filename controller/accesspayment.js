const Payment = require("../models/Foruser/payment");
const Historycourse = require("../models/Foruser/historycourses");
const mongoose = require("mongoose"); // Import mongoose for transactions
const accesspayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start a transaction
  try {
    const { statusAccess, user } = req.body;
    // //req.params._id; ///payment_id

    // Fetch the payment history
    const paymentHistoryUser = await Payment.findOne({ _id: req.params._id })
      .populate("cart_course")
      .session(session);
    if (!paymentHistoryUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: " payment not found" });
    }
    console.log(paymentHistoryUser);
    // Fetch the associated payment_id in Historycourse

    // Create a new history record
    const newHistory = new Historycourse({
      admin: req.admin._id,
      historycourse: paymentHistoryUser, // Storing the entire Payment document
      statusAccess: statusAccess,
      user: paymentHistoryUser.user,
      historycourseforpayment: {
        _id: paymentHistoryUser._id,
        user: paymentHistoryUser.user,
        cart: {
          _id: paymentHistoryUser.cart_course._id,
          admin: paymentHistoryUser.cart_course.admin,
          categories: paymentHistoryUser.cart_course.categories,
          courses: paymentHistoryUser.cart_course.courses,
        },
        email: paymentHistoryUser.email,
        tel: paymentHistoryUser.tel,
        typePayment: paymentHistoryUser.typePayment,
        statusAccess: paymentHistoryUser.statusAccess,
        cart_id: paymentHistoryUser.cart_id,
      },
    });
    await newHistory.save({ session });

    // Delete the payment record after saving to Historycourse
    await Payment.findByIdAndDelete(req.params._id).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    // Return a success response
    return res.status(200).json({
      success: true,
      message: "access courses",
      history: newHistory,
    });
  } catch (err) {
    // In case of an error, abort the transaction and return error message
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports.accesspayment = accesspayment;
