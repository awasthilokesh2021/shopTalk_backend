const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connection successful"))
.catch((error) => console.log("❌ Connection error: " + error.message));

