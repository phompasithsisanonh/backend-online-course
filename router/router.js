const express = require("express");
const router = express.Router();
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { body } = require("express-validator");
const uploadDir = path.join(__dirname, "../uploads");
const { register, login } = require("../controller/auth/auth");
const { courses, getcourses, getcoureseById } = require("../controller/courses");
const Admin = require("../models/Foradmin/admin");
const User = require("../models/Foruser/user");
const { cart } = require("../controller/cart");
const { loginUser, registerUser } = require("../controller/authUser/authUser");
const { payment } = require("../controller/payment");
const { accesspayment } = require("../controller/accesspayment.js");
const {
  addComment,
  getCommentsByCourse,
  getCommentsByCourseSingle,
} = require("../controller/comment_star/comment_star");
const {
  getcartuser,
  getIdPaymentId,
  getpaymentdata,
  gethistory,
} = require("../controller/getalldatauser/gertcartuser");
const { prograss, getprograss } = require("../controller/prograss.js");
const { getprofile ,updateProfile} = require("../controller/authUser/updateProfile.js");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to ensure unique filenames
  },
});
const upload = multer({ storage: storage });

const AuthTicat = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.TOKEN_SECRET
    );
    const currentUser = await Admin.findById(decoded._id);
    if (!currentUser) {
      return res.status(401).json({
        status: "error",
        message: "The user belonging to this token does no longer exist.",
      });
    }

    req.admin = currentUser;
    res.locals.admin = currentUser;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error: " + error.message,
    });
  }
};
/////for user authortoken
const AuthTokenUser = async (req, res, next) => {
  try {
    let token;


    // Check for Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Log extracted token


    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);
    const currentUser = await User.findById(decoded._id);

    if (!currentUser) {
      return res.status(401).json({
        status: "error",
        message: "The user belonging to this token does no longer exist.",
      });
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error: " + error.message,
    });
  }
};

router.post("/register", register);
router.post("/login", login);
router.post(
  "/course",
  [
    body("courses").isArray().withMessage("Courses must be an array"),
    body("categories").notEmpty().withMessage("Categories are required"),

    body("courses.*.title").notEmpty().withMessage("Course title is required"),
    body("courses.*.description")
      .notEmpty()
      .withMessage("Course description is required"),
    body("courses.*.price").notEmpty().withMessage("Course price is required"),

    body("courses.*.lessons").isArray().withMessage("Lessons must be an array"),

    body("courses.*.lessons.*.titleSmaller")
      .notEmpty()
      .withMessage("Lesson title is required"),
    body("courses.*.lessons.*.descriptionSmaller")
      .notEmpty()
      .withMessage("Lesson description is required"),
  ],
  AuthTicat,
  courses
);

router.post("/cart/:_id", AuthTokenUser, cart);
router.post("/payment/:_id", AuthTokenUser, payment);
router.post("/access/:_id", AuthTicat, accesspayment);

//comment
router.post("/comment/:_id", AuthTokenUser, addComment);
router.get("/allcomment/:_id", AuthTokenUser, getCommentsByCourse);
router.get("/allcommentCourese/:_id", getCommentsByCourseSingle);
router.get("/getPaymentcartId/:_id", AuthTokenUser, getIdPaymentId);
router.get("/allcourse", getcourses);
router.get("/getcart", AuthTokenUser, getcartuser);
router.get("/getpayment", AuthTokenUser, getpaymentdata);
router.get("/gethistory/:_id", gethistory);
router.get("/getcomment_rating/:_id", getCommentsByCourse);
router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.post("/prograss",AuthTokenUser,prograss)
router.get("/getprograss/:_id",AuthTokenUser,getprograss)
router.get("/protest", (req, res, next) => {
  try {
    if (req.cookies.token) {
      return res.status(200).json({ message: "token end" });
    }
    return res.status(403).json({ message: "Unauthorized" });
  } catch (error) {}
});
router.get('/getprofile' ,AuthTokenUser,getprofile)
router.post('/updateProfile' ,upload.single("image"),AuthTokenUser,updateProfile)

router.get('/getcoureseId/:_id',getcoureseById)

module.exports = router;
