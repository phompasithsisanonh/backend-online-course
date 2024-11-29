const { hashPassword, compare1 } = require("../../helper/hashPassword");
const User = require("../../models/Foruser/user");
const JWT = require("jsonwebtoken");
const registerUser = async (req, res, next) => {
  try {
    const {
      firstName,
      email,
      password,
      intro,
      note,
      major,
      detail,
      tel,
    } = req.body;
    const usernameRegex = /^[a-zA-Z0-9]{3,16}$/; // Alphanumeric, 3-16 characters
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least one letter, one number, 8+ chars
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters, with letters and numbers.' });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    const exisitingUser = await User.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await new User({
      email,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in Registeration",
      error,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await compare1(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = await JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "3d",
    });
    if (token) {
      res.cookie("token", token, {
        httpOnly: true,
        securre: true,
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "err in login",
      err,
    });
  }
};
module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
