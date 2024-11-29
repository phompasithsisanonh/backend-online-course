const Progras = require("../models/Foruser/prograss");

const prograss = async (req, res) => {
  try {
    const { score, historycourse,idforringall, completedLessons } = req.body;
    const user = req.user._id;

    // Find if progress already exists for the user and historyId
    const findID = await Progras.findOne({ historycourse: historycourse });

    if (findID) {
      // If progress exists, check if the checkbox is checked or unchecked
      if (completedLessons === true) {
        // If checked, add the score
        findID.score += score;
      } else {
        // If unchecked, subtract the score
        findID.score -= score;
      }

      // Update the completedLessons status
      findID.completedLessons = completedLessons;

      // Save the updated progress
      await findID.save();

      return res
        .status(200)
        .json({ findID, message: "Progress updated successfully." });
    } else {
      // If no progress exists, create a new progress entry
      const pro = new Progras({
        user: user,
        historycourse: historycourse,
        score: score,
        completedLessons: completedLessons,
        idforringall:idforringall,
      });
      await pro.save(); // Save the new progress

      return res
        .status(200)
        .json({ pro, message: "Progress saved successfully." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error processing request." });
  }
};

module.exports.prograss = prograss;
const getprograss = async (req, res) => {
  try {
    const countdocument = await Progras.countDocuments({
      user: req.user._id,idforringall:req.params._id
    });
    const res_id = await Progras.find({
      user: req.user._id,idforringall:req.params._id
    });
    res.json({res_id,countdocument});
  } catch (err) {
    console.log(err);
  }
};
module.exports.getprograss = getprograss;
