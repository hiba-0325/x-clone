import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";
import CustomError from "../utils/customError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGen from "../utils/otpGenerator.js";
import transporter from "../config/nodemailer.js";
import joiUserSchema from "../models/joiSchema.js";

const sendOtp = async (req, res, next) => {
  const { email, userName } = req.body;
  const existingEmail = await User.findOne({ email });
  const existingUserName = await User.findOne({ userName });
  if (existingEmail || existingUserName) {
    return next(new CustomError("Email or username already exists", 400));
  }
  const otp = otpGen();
  const otpInput = new Otp({
    email,
    otp,
  });
  await otpInput.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP code for Verification",
    text: `hello ${userName}, your verification code for X clone app is ${otp} `,
  };
  await transporter.sendMail(mailOptions);

  res
    .status(200)
    .json({ message: "OTP has been successfully send to your email" });
};

const verifyRegister = async (req, res, next) => {
  const { value, error } = joiUserSchema.validate(req.body);
  if (error) {
    return next(new CustomError("Invalid input", 400));
  }
  const { name, email, otp, userName, password } = value;

  const otpInput = await Otp.findOne({ email, otp });

  if (!otpInput) {
    Otp.deleteMany({ email });
    return next(new CustomError("invalid Otp", 400));
  }
  Otp.deleteMany({ email });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    userName,
    email,
    password: hashedPassword,
    
  });
  await user.save();

  res.status(201).json({ message: "User successfully registered" });
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("user is not found", 404));
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return next(new CustomError("incorrect password", 401));
  }
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: "3d" }
  );
  const userDetail = {
    fullname: user.name,
    username: user.userName,
    profile: user.pfp,
    header: user.header,
    bio: user.bio,
    location: user.location,
    _id: user._id,
  };

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res
    .status(200)
    .json({ message: "successfully logged in", userDetail, accessToken });
};
const userLogout = async (req, res,) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "logged out successfully" });
};

const refreshingToken = async (req, res, next) => {
  if (!req.cookies) {
    return next(new CustomError("No cookies found", 401));
  }
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new CustomError("No refresh Token found", 401));
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

  if (!decoded) {
    return next(new CustomError("invalid refresh Token", 401));
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new CustomError("User Not Found", 404));
  }

  let accessToken = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
    expiresIn: "1d",
  });
  res.status(200).json({ message: "Token refreshed", accessToken });
  
};



export { sendOtp, verifyRegister, userLogin, userLogout, refreshingToken };
