import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import socket from "../socket";

export default function Dashboard() {
  const [gigs, setGigs] = useState([]);
  const navigate = useNavigate();

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem("userId");

  // 1️⃣ DATA FETCHING LOGIC (Defined first to avoid hoisting errors)
  const fetchGigs = useCallback(() => {
    api
      .get("/gigs")
      .then((res) => setGigs(res.data))
      .catch((err) => console.error("Error fetching gigs:", err));
  }, []);

  // 2️⃣ SOCKET REAL-TIME LOGIC
  useEffect(() => {
    if (!currentUserId) return;

    // Join a private room based on user ID
    socket.emit("join", currentUserId);

    // Listen for the "hired" event
    socket.on("hired", (data) => {
      alert(data.message);
      // Now fetchGigs is safely declared and can be called
      fetchGigs();
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("hired");
    };
  }, [currentUserId, fetchGigs]);

  // 3️⃣ INITIAL DATA FETCH
  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Logout */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-2xl font-black text-blue-600 tracking-tight">
              GigFlow
            </span>
            <div className="flex items-center gap-4">
              <Link
                to="/create-gig"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 text-sm"
              >
                + Post a Gig
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 font-bold text-sm px-3"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Explore Gigs
          </h1>
          <p className="text-gray-500 mt-2">
            Find the perfect opportunity for your skills.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  {/* Dynamic Status Badge */}
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      gig.status === "open"
                        ? "bg-green-50 text-green-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {gig.status === "open" ? "Open" : "Assigned"}
                  </span>

                  <span className="text-2xl font-black text-gray-800">
                    ₹{gig.budget}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {gig.title}
                </h2>

                {/* Identify Owned Gigs */}
                {gig.ownerId === currentUserId && (
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">
                    Your Post
                  </p>
                )}

                <p className="text-gray-600 text-sm line-clamp-2 mb-6">
                  {gig.description}
                </p>
              </div>

              <Link
                to={`/gig/${gig._id}`}
                className="inline-flex items-center justify-center w-full py-3 rounded-2xl font-bold transition-all bg-gray-50 group-hover:bg-blue-600 text-gray-900 group-hover:text-white"
              >
                View Details
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {gigs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">
              No gigs found. Be the first to post one!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
