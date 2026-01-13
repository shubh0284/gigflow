const express = require("express");
const router = express.Router();
// IMPORTANT: Add getGigById to this list
const {
  createGig,
  getGigs,
  getGigById,
} = require("../controllers/gigController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/", getGigs);
router.get("/:id", getGigById); // This line will stop crashing now!

// Protected route
router.post("/", authMiddleware, createGig);

module.exports = router;
