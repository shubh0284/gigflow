const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const bidRoutes = require("./routes/bidRoutes");
const { initSocket } = require("./socket");

dotenv.config();
connectDB();

const app = express();

// ✅ REQUIRED FOR RENDER (secure cookies + proxy)
app.set("trust proxy", 1);

// ✅ MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// ✅ CORS (THIS ALONE HANDLES OPTIONS REQUESTS)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gigflow-eight-kappa.vercel.app",
      "https://gigflow-kyl8ok51s-shubham-shinares-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ❌ REMOVED app.options("*", cors());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT} with Socket support`);
});
