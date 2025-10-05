import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import API from "./api/api";
import Loginn from "./components/Loginn";
import Dashboard from "./components/Dashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import ViewCardPage from "./components/viewCardPage"; // new

export default function App() {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      try {
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorker(res.data.worker);
      } catch (err) {
        console.log("Invalid or expired token");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("worker");
    setWorker(null);
  };

  return (
    <Router> 
      <Routes>
        {/* Public page: can open directly */}
        <Route path="/view-card" element={<ViewCardPage />} />

        {/* Login page */}
        <Route
          path="/login"
          element={
            !worker ? (
              <Loginn
                onLogin={(workerData) => {
                  setWorker(workerData);
                  localStorage.setItem("worker", JSON.stringify(workerData));
                }}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            worker ? (
              worker.role === "owner" ? (
                <OwnerDashboard worker={worker} onLogout={handleLogout} />
              ) : (
                <Dashboard worker={worker} onLogout={handleLogout} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
