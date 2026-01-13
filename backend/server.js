const express = require("express");
const http = require("http"); // Required for Socket.io
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const { initSocket } = require("./socket"); // ✅ Import your socket helper

dotenv.config();
connectDB();

const app = express();

// ✅ MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // ✅ Mandatory for HttpOnly cookies
  })
);

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", require("./routes/bidRoutes"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ✅ SOCKET.IO INTEGRATION
const server = http.createServer(app); // Create the HTTP server using app
initSocket(server); // Initialize Socket.io with that server

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT} with Socket support`);
});
