const { Schema, model } = require("mongoose");

const PaymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cart: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Cart",
    },
    cart_course:{
      type: Object,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    typePayment: {
      type: String,
      required: true,
    },
    statusAccess: {
      type: String,
      required: true,
    },
    cart_id:{
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);
PaymentSchema.virtual("historyCourses", {
  ref: "HistoryCourses",
  localField: "_id",
  foreignField: "historycourse",
});
module.exports = model("Payment", PaymentSchema);
