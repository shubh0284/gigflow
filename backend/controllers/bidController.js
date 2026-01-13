const mongoose = require("mongoose");
const Bid = require("../models/Bid");
const Gig = require("../models/Gig");
const { getIO } = require("../socket"); // ✅ Import Socket helper

// 1️⃣ SUBMIT A BID
exports.createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;
    if (!gigId || !message || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.status !== "open") {
      return res.status(400).json({ message: "Bidding closed for this gig" });
    }

    if (gig.ownerId.toString() === req.user.id) {
      return res
        .status(403)
        .json({ message: "Owners cannot bid on their own gigs" });
    }

    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user.id });
    if (existingBid) {
      return res
        .status(400)
        .json({ message: "You have already applied to this gig" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      message,
      price,
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ GET BIDS FOR A GIG
exports.getBidsByGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ HIRE A BID (WITH REAL-TIME NOTIFICATION)
exports.hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    // Populate gigId to get the title for the notification later
    const bid = await Bid.findById(bidId).populate("gigId").session(session);
    if (!bid) throw new Error("Bid not found");

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) throw new Error("Gig not found");

    if (gig.ownerId.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Not authorized" });
    }

    if (gig.status === "assigned") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Gig already assigned" });
    }

    // STEP 1: Update selected bid
    await Bid.findByIdAndUpdate(bidId, { status: "hired" }, { session });

    // STEP 2: Reject others
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidId } },
      { status: "rejected" },
      { session }
    );

    // STEP 3: Close Gig
    await Gig.findByIdAndUpdate(gig._id, { status: "assigned" }, { session });

    await session.commitTransaction();
    session.endSession();

    // ✅ STEP 4: SEND REAL-TIME NOTIFICATION
    const io = getIO();
    io.to(bid.freelancerId.toString()).emit("hired", {
      message: `You have been hired for "${bid.gigId.title}"! 🎉`,
    });

    res.status(200).json({ message: "Freelancer hired and notified!" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};
