const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const { initSocket } = require("./socket");

dotenv.config();
connectDB();

const app = express();

// ✅ 1. ADDED TRUST PROXY (Required for Render to handle secure cookies properly)
app.set("trust proxy", 1);

// ✅ MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    // ✅ Ensure your Vercel URL has NO trailing slash at the end
    origin: ["http://localhost:5173", "https://gigflow-eight-kappa.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", require("./routes/bidRoutes"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT} with Socket support`);
});
