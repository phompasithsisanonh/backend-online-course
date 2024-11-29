const { Schema, model } = require("mongoose");
const courseSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    categories: {
      type: String,
      required: true,
    },
    courses: [
      {
        title: {
          type: String,
        },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        price: { type: Number, required: true },
        details: { type: String, required: true },
        lessons: [
          {
            titleSmaller: { type: String, required: true },
            descriptionSmaller: { type: String, required: true },
            videoUrl: { type: String, required: true },
          },
        ],
        uploadedBy: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);
courseSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "course",
});
courseSchema.virtual("star", {
  ref: "Star",
  localField: "_id",
  foreignField: "course",
});
courseSchema.virtual("cart", {
  ref: "Cart",
  localField: "_id",
  foreignField: "items",
});
courseSchema.virtual("payment", {
  ref: "Payment",
  localField: "_id",
  foreignField: "cart",
});
module.exports = model("Course", courseSchema);
