import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { PASSWORD_RESET_TEMPLATE,EMAIL_VERIFY_TEMPLATE } from "../config/emailTemplates.js";


export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // sending welcome email
    const mailoptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "welcome to our webisite",
      text: `Welome to our webiste you account has been created with email ${email}`,
    };
    await transporter.sendMail(mailoptions);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
// Send verfication otp to user email
export const sendVerfiyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOptExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification otp",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    };
    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "verification OPT sent on Email.",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "missing Details" });
  }
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    if (user.verifyOtp === "" || user.verifyOtp != otp) {
      return res.json({ success: false, message: "Inavlid OTP." });
    }
    if (user.verifyOptExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired." });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOptExpireAt = "";
    await user.save();
    return res.json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required." });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user not found." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOptExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset otp",
      // text: `Your password reset otp is ${otp}.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    };
    await transporter.sendMail(mailOption);
    return res.json({ success: true, message: "otp send to your mail" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const verifyOtp = async (req,res)=>{
  const {otp,email}=req.body;
  if(!otp || !email){
    return res.json({success : false,message : "Missing otp"})

  }
  try {
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({success:false , message : "User not found."})
    }
    if(user.resetOtp == ''|| user.resetOtp !=otp){
      return res.json({success : false, message : "Invalid Otp"})
    }
    if (user.resetOptExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    user.resetOtp = '';
    user.resetOptExpireAt = 0;
    user.save()
    return res.json({success : true, message : "Otp verified."})
  } catch (error) {
    return res.json({success : false , message : error.message})
  }
}
export const setNewPassword = async (req,res) =>{
  const {email,newPassword}=req.body;
  if(!email || !newPassword){
    return res.json({success : false , message : "misssing details"})
  }
  try {
    const user  = await userModel.findOne({email})
    if(!user){
      return res.json({success : false  ,message : "User not found"})
    }
    const hashedPassword = await bcrypt.hash(newPassword,10)

    user.password = hashedPassword
    await user.save()
    return res.json({success : true,message : "Password Updated"})
    
  } catch (error) {
    return res.json({success : false , message : error.message})
  }
}

