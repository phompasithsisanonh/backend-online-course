const { Schema, model } = require("mongoose");

const prograssSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    historycourse: {
      type: String,
      required: true,
    },
    idforringall:{
      type: String,
      required: true,
    },
    score:{
        type:Number,
        required: true,
    },
    completedLessons:{
        type:Boolean,
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("Prograss", prograssSchema);
