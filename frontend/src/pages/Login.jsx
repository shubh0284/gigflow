import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added for UX
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Send login request
      const response = await api.post("/auth/login", { email, password });

      // 2. Clear any old data first to avoid role confusion
      localStorage.clear();

      // 3. Store essential user data
      localStorage.setItem("isLoggedIn", "true");

      /**
       * CRITICAL: Extract and save the userId
       * We use a fallback check to handle different backend response styles.
       */
      const userId = response.data.user?._id || response.data._id;

      if (userId) {
        localStorage.setItem("userId", userId);
      } else {
        console.warn(
          "User ID not found in response. Ownership features may not work."
        );
      }

      // 4. Redirect to home and replace history
      navigate("/", { replace: true });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Please enter your details to sign in.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="border border-gray-300 p-3 rounded-lg w-full outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="border border-gray-300 p-3 rounded-lg w-full outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`p-3 mt-4 w-full rounded-lg font-semibold transition-all duration-200 shadow-md ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
            }`}
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
