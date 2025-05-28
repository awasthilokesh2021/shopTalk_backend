const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    
  const { name, email, password, phone, address } = req.body;

    try {
      const userExist = await User.findOne({ email });
      if (userExist) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
       const user = await User.create({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
      });
  
      res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
 
  // Login user
  exports.loginUser = async (req, res) => {
    
    const { email, password } = req.body;
    console.log(email)
  
    try {
      const user = await User.findOne({ email });
      
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
     
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      // console.log(token," token generated");
      
    res.cookie("token", token, {
             httpOnly: true, 
             secure: true,        
             sameSite: "None",     
             maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  
      res.status(200).json({ message: "Login successful", user: { name: user.name, role: user.role } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  //logout user
  exports.logoutUser = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
  };


