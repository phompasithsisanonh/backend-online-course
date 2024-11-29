const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    comment: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 500,
    },
    rating: {
      type: Number,
      required: true,
    },
    cart:{
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
