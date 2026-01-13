import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateGig() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const navigate = useNavigate();

  const submitGig = async (e) => {
    // Prevent page refresh if using inside a form tag
    if (e) e.preventDefault();
    try {
      await api.post("/gigs", { title, description, budget });
      alert("Gig posted successfully!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      {/* Main Container Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 max-w-2xl w-full border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Post a New Gig
          </h2>
          <p className="text-gray-500 mt-2">
            Hire the best talent for your project
          </p>
        </div>

        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Job Title
            </label>
            <input
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-gray-800"
              placeholder="e.g. Full Stack Developer needed for SaaS"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              rows="4"
              className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-gray-800"
              placeholder="Tell freelancers exactly what you need..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Budget Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Project Budget ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-gray-400 font-bold">
                $
              </span>
              <input
                type="number"
                className="w-full border-2 border-gray-100 bg-gray-50 p-4 pl-10 rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-gray-800"
                placeholder="500"
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={submitGig}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl active:scale-95 mt-4"
          >
            Launch My Gig
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">
          Your gig will be visible to all freelancers immediately.
        </p>
      </div>
    </div>
  );
}
