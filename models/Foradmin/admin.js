const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
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
    intro: {
      type: String,
    },
    note: {
      type: String,
    },
    major: {
      type: String,
    },
    detail: {
      type: String,
    },
  },
  { timestamps: true }
);
adminSchema.virtual("course", {
    ref: "Course",
    localField: "_id",
    foreignField: "admin",
  });
  adminSchema.virtual("historyCourses", {
    ref: "HistoryCourses",
    localField: "_id",
    foreignField: "admin",
  });
module.exports = model("Admin", adminSchema);
