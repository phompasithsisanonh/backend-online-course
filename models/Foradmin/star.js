const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course", // Reference to Course
    },
  },
  { timestamps: true }
);

module.exports = model("Star", commentSchema);
