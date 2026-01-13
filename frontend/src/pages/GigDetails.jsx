import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function GigDetails() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  // Get current user ID to check ownership
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both Gig info and Bids list in parallel
      const [gigRes, bidsRes] = await Promise.all([
        api.get(`/gigs/${id}`),
        api.get(`/bids/${id}`),
      ]);
      setGig(gigRes.data);
      setBids(bidsRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const hire = async (bidId) => {
    try {
      // Triggers transactional logic: Hires one, rejects others, assigns gig
      await api.patch(`/bids/${bidId}/hire`);
      alert("Freelancer hired successfully! 🎉");
      fetchData(); // Refresh UI to show "Assigned" and "Rejected" statuses
    } catch {
      alert("Hiring failed. Please check permissions.");
    }
  };

  const submitBid = async (e) => {
    e.preventDefault();
    try {
      await api.post("/bids", { gigId: id, message, price });
      alert("Bid submitted! 🚀");
      setMessage("");
      setPrice("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Bid failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-blue-600 animate-pulse">
          Loading project details...
        </div>
      </div>
    );

  // Safety check to prevent app crash if gig data is missing
  if (!gig)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Gig not found.</h2>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="text-blue-600 underline"
        >
          Return to Dashboard
        </button>
      </div>
    );

  // Helper to safely compare IDs
  const isOwner = gig.ownerId?.toString() === currentUserId?.toString();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* --- GIG INFO --- */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <span
              className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                gig.status === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {gig.status === "open" ? "Open" : "Assigned"}
            </span>
            <h2 className="text-3xl font-black text-gray-800">₹{gig.budget}</h2>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            {gig.title}
          </h1>
          <p className="text-gray-600 leading-relaxed text-lg">
            {gig.description}
          </p>
        </div>

        {/* --- BID FORM (Only for non-owners and open gigs) --- */}
        {gig.status === "open" && !isOwner && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white font-bold text-xl">
              Submit Your Bid
            </div>
            <form onSubmit={submitBid} className="p-8 space-y-4">
              <textarea
                className="w-full border-2 p-4 rounded-2xl bg-gray-50 outline-none focus:bg-white focus:border-blue-500 transition-all"
                placeholder="Why should they hire you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  className="flex-1 border-2 p-4 rounded-2xl bg-gray-50 outline-none focus:bg-white focus:border-blue-500"
                  placeholder="Proposed Price (₹)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
                >
                  Apply Now
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- BIDS LIST --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-gray-900">
              Recent Applications
            </h2>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {bids.length} Bids
            </span>
          </div>

          {bids.length > 0 ? (
            bids.map((bid) => (
              <div
                key={bid._id}
                className={`bg-white p-6 rounded-3xl border-2 flex justify-between items-center transition-all ${
                  bid.status === "hired"
                    ? "border-green-400 bg-green-50"
                    : bid.status === "rejected"
                    ? "border-red-100 bg-red-50 opacity-80"
                    : "border-gray-50 shadow-sm"
                }`}
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                      {bid.freelancerId?.name?.charAt(0) || "U"}
                    </div>
                    {bid.freelancerId?.name || "Anonymous"}
                  </h3>
                  <p className="text-gray-500 italic mt-1">"{bid.message}"</p>
                  <p className="text-blue-600 font-bold mt-2">₹{bid.price}</p>
                </div>

                <div className="flex gap-3">
                  {/* Status Badges */}
                  {bid.status === "hired" && (
                    <span className="bg-green-500 text-white px-5 py-2 rounded-xl font-bold text-xs uppercase shadow-md">
                      HIRED
                    </span>
                  )}
                  {bid.status === "rejected" && (
                    <span className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold text-xs uppercase">
                      REJECTED
                    </span>
                  )}

                  {/* Hire Button logic: Only owner sees it, only for open gigs */}
                  {isOwner &&
                    gig.status === "open" &&
                    bid.status === "pending" && (
                      <button
                        onClick={() => hire(bid._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow-md transition-all active:scale-90"
                      >
                        Hire
                      </button>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
              No applications submitted yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
