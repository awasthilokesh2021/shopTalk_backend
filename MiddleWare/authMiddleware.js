const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//getAuth
const getAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    //console.log("Token received:", token);

    if (!token) {
      return res.status(401).json({ error: "Access Denied! No token provided." });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = id;

    const user = await User.findById(req.userID).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    req.user = user;

    next();
  
  } catch (error) {
    console.error("❌ Authentication Error:", error);
    res.status(401).json({ error: "Invalid or Expired Token!" });
  }
};

module.exports = getAuth;
