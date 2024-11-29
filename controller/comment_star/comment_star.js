const Comment = require("../../models/Foradmin/comment");

const commentValidationSchema =require('../../validation/validation_comment')

const addComment = async (req, res) => {
  try {
    const { comment,  rating,cart} = req.body;
    const user = req.user._id;          // user_id
    const course = req.params._id;      // course_id

    // Validate input using Joi
    const { error } = commentValidationSchema.validate({ comment });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    if(user == null || course==null){
        return res.status(400).json({ message:"server error" });
    }
    // Create and save the new comment if validation passes
    const newComment = new Comment({
      user: user,
      course: course,
      cart:cart,
      comment,
       rating,
    });
    await newComment.save();
    res.status(201).json({ message: "Comment added successfully", newComment });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error adding comment" });
  }
};
// Get all comments for a specific course
const getCommentsByCourse = async (req, res) => {
  try {
    const  courseId = req.params._id;
    const comments = await Comment.find({ course: courseId }).populate("course");
   
   
    res.status(200).json(comments);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error fetching comments" });
  }
};
const getCommentsByCourseSingle = async (req, res) => {
  try {
    const  courseId = req.params._id;
    const commentsCourese = await Comment.find({ cart: courseId }).populate("course");
   
    res.status(200).json(commentsCourese);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error fetching comments" });
  }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};
module.exports.addComment =addComment
module.exports.getCommentsByCourse =getCommentsByCourse
module.exports.getCommentsByCourseSingle=getCommentsByCourseSingle