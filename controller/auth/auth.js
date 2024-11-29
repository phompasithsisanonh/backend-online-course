const { hashPassword, compare1 } = require("../../helper/hashPassword");
const Admin =require("../../models/Foradmin/admin")
const JWT = require("jsonwebtoken");
const register =async(req,res,next)=>{
    try {
        const { firstName, email, password,intro,note,major,detail,tel } = req.body;
        if (!email) {
          return res.send({ message: "Email is Required" });
        }
        if (!password) {
          return res.send({ message: "Password is Required" });
        }
        const exisitingadmin = await Admin.findOne({ email });
        //exisiting admin
        if (exisitingadmin) {
          return res.status(200).send({
            success: false,
            message: "Already Register please login",
          });
        }
        const hashedPassword = await hashPassword(password);
        const admin = await new Admin({
          email,
          password: hashedPassword,
        }).save();
        res.status(201).send({
          success: true,
          message: "admin Register Successfully",
          admin,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "error in Registeration",
          error,
        });
      }
}
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).send({
          success: false,
          message: "Email is not registerd",
        });
      }
      const match = await compare1(password, admin.password);
      if (!match) {
        return res.status(404).send({
          success: false,
          message: "Invalid Password",
        });
      }
      const token = await JWT.sign({ _id: admin._id },  process.env.TOKEN_SECRET, {
        expiresIn: "3d",
      });
      if(token){
        res.cookie('token',token,{
          httpOnly:true,
          securre:true,
          sameSite:'Strict',
          maxAge:24*60*60*1000
        })
      }
      res.status(200).send({
        success: true,
        message: "login successfully",
        admin: {
          _id: admin._id,
          firstName: admin.firstName,
          email: admin.email,
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
module.exports.register= register;
module.exports.login= login;