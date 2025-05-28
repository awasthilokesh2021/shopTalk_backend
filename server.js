const express = require("express");
require("./conn/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();

// Updated allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
];

// ✅ Smart CORS handler
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ Logging every incoming request
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api', productRoutes);
// practice route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT: ${PORT}`);
});
