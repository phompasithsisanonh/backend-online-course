const User = require("../../models/Foruser/user");
const updateProfile = async (req, res) => {
  try {
    const { firstName, note, detail, tel, address } = req.body;

    // Extract file path if an image is uploaded
    let image;
    if (req.file) {
      image = `../uploads/${req.file.filename}`
    }
   
    // Ensure user ID exists
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID not provided" });
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, note, detail, tel, address, image },
      { new: true, runValidators: true } // Return updated document and apply validations
    );

    if (updatedUser) {
      return res.status(200).json({
        success: true,
        user: updatedUser,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    console.error("Error updating profile:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = updateProfile;

const getprofile = async (req, res) => {
  try {
    const findUser = await User.findOne(req.user._id);
    res.status(200).json(findUser);
  } catch (error) {
    console.log(error);
  }
};
module.exports.updateProfile = updateProfile;
module.exports.getprofile = getprofile;
