const { Schema, model } = require("mongoose");

const CartSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    items:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Course",
    },
  },
  { timestamps: true }
);
CartSchema.virtual("payment", {
  ref: "Payment",
  localField: "_id",
  foreignField: "cart",
});
module.exports = model("Cart", CartSchema );
