const { Schema, model } = require("mongoose");

// // Define the sub-schema for `historycourse`
// const subHistoryCourseSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Ensure you have a 'User' model
//     required: true,
//   },
//   membership_courses: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Cartuser', // Ensure you have a 'MembershipCourse' model
//     required: true,
//   },
//   typePayment: {
//     type: String,
//   },
//   statusAccess: {
//     type: String,
//   },
// }, { _id: false }); // Prevents creating a new _id for subdocuments

// Main schema
const historyCourseSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    user:{
      type: String,
      required: true,
    },
    historycourse: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Payment",
    },
    historycourseforpayment: {
      type: Object,
      required: true,
    },
    dateAccessed: {
      type: Date,
      default: Date.now,
    },
    statusAccess: {
      type: String,
    },
  },
  { timestamps: true }
);
// historyCourseSchema.virtual("prograssSchema", {
//   ref: "PrograssSchema",
//   localField: "_id",
//   foreignField: "historycourse",
// });
module.exports = model("HistoryCourses", historyCourseSchema);
