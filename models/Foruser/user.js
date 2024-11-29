const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
    },
    address: {
      type: String,
    },
    detail: {
      type: String,
    },
    job: {
      type: String,
    },
    note: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.virtual("star", {
  ref: "Star",
  localField: "_id",
  foreignField: "user",
});
userSchema.virtual("comment", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
});
userSchema.virtual("cart", {
  ref: "Cart",
  localField: "_id",
  foreignField: "user",
});
userSchema.virtual("payment", {
  ref: "Payment",
  localField: "_id",
  foreignField: "user",
});
userSchema.virtual("prograss", {
  ref: "Prograss",
  localField: "_id",
  foreignField: "user",
});

module.exports = model("User", userSchema);
