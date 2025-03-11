const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const appConfig = require("../config/app.config");

const SALT_ROUNDS = appConfig.brcrypt_salt_rounds;
const JWT_SECRET = appConfig.JWT_SECRET;
const JWT_EXPIRY = appConfig.jwt_expiry;

const registerUser = async ({ username, email, password }) => {
  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: "User already exists with this email" };
    }
    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
    console.log(salt);
    const hashedPassword = await bcrypt.hash(password, salt);
console.log(hashedPassword);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    console.log(newUser);
    const savedUser = await newUser.save();
console.log(savedUser);
    const userResponse = {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email
    };

    return userResponse;
  } catch (error) {
    console.error("Register Service Error:", error.message);
    throw error;
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 400, message: "Invalid credentials" };
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    };
  } catch (error) {
    console.error("Login Service Error:", error.message);
    throw error;
  }
};



module.exports = {
  registerUser,
  loginUser,
};
