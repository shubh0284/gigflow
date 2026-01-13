const express = require("express");
const router = express.Router();
const {
  createBid,
  getBidsByGig,
  hireBid,
} = require("../controllers/bidController");
const authMiddleware = require("../middleware/authMiddleware");

// Submit bid
router.post("/", authMiddleware, createBid);

// Get bids for gig (owner only)
router.get("/:gigId", authMiddleware, getBidsByGig);

// hired bids
router.patch("/:bidId/hire", authMiddleware, hireBid);

module.exports = router;
