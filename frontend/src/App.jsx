import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateGig from "./pages/CreateGig";
import GigDetails from "./pages/GigDetails";

function App() {
  // Check if a login flag exists
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Routes>
      {/* If logged in, go to Dashboard. If not, go to Register */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/register" replace />
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes: Prevents unauthenticated users from seeing these pages */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/create-gig"
        element={isAuthenticated ? <CreateGig /> : <Navigate to="/login" />}
      />
      <Route
        path="/gig/:id"
        element={isAuthenticated ? <GigDetails /> : <Navigate to="/login" />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
