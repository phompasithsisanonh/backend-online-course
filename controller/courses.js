const Courses = require("../models/Foradmin/course");
const { upload } = require("../middleware/videoMiddle");
const Admin = require("../models/Foradmin/admin");
const courses = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    // Parse courses and categories as JSON if they are passed as strings
    const { courses, categories } = req.body;

    if (!courses || !categories) {
      return res.status(400).json({
        success: false,
        message: "Please enter course details and categories.",
      });
    }

    const userId = req.admin._id;

    // Set video and image URLs if files are uploaded
    const videoUrl = req.files.videoFile
      ? `../uploads/videos/${req.files.videoFile[0].filename}`
      : "";
    const imageUrl = req.files.imageFile
      ? `../uploads/images/${req.files.imageFile[0].filename}`
      : "";

    try {
      // Add video URL to each lesson in the course
      if (courses.length > 0) {
        courses.forEach((course) => {
          course.lessons.forEach((lesson) => {
            lesson.videoUrl = videoUrl; // Assign the video URL to each lesson
          });
          // Optionally assign imageUrl at the course level
          course.imageUrl = imageUrl;
        });
      }

      const newCourses = new Courses({
        admin: userId,
        categories: categories,
        courses: courses,
      });

      await newCourses.save();

      res.status(201).json({
        message: "Courses successfully created",
        courses: newCourses,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error, failed to create courses",
      });
    }
  });
};
const getcourses = async (req, res, next) => {
  try {
    const getcourses = await Courses.find();
    res.status(200).json(getcourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error, failed to retrieve courses",
    });
  }
};
const getcoureseById = async (req, res) => {
  try {
    const getcourses = await Courses.findById(req.params._id);
 
    res.status(200).json({
      success: true,
      getcourses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error, failed to retrieve courses",
    });
  }
};
module.exports = { courses, getcourses };
module.exports.getcoureseById = getcoureseById;
