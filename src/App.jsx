import { useState, useEffect } from "react";
import API from "./api/api";
import Loginn from "./components/Loginn";
import Dashboard from "./components/Dashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import EnableNotifications from "./components/NotificationButton";

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

  if (!worker)
    return (
      <Loginn
        onLogin={(workerData) => {
          setWorker(workerData);
          localStorage.setItem("worker", JSON.stringify(workerData));
        }}
      />
    );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("worker");
    setWorker(null);
  };

  // Show different dashboards based on role
  return (
    <div>
      <EnableNotifications />
      {worker.role === "owner" ? (
        <OwnerDashboard worker={worker} onLogout={handleLogout} />
      ) : (
        <Dashboard worker={worker} onLogout={handleLogout} />
      )}
    </div>
  );
}
