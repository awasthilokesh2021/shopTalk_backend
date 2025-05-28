const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const getAuth = require("../MiddleWare/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// GET Logged-in User Info
router.get("/me", getAuth, (req, res) => {
    const { _id, name, email, role, address, phone } = req.user;
    res.status(200).json({ _id, name, email, role, address, phone });
  });


module.exports = router;
