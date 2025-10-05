import { useEffect, useState } from "react";
import API from "../api/api";
import { FaUserClock, FaUserEdit, FaUsers, FaUserPlus, FaIdCard, FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CustomerForm from "./CustomerFormm";
import ViewCard from "./ViewCard";
import UpdatePurchase from "./UpdatePurchase";
import Card from "./card";
import "./OwnerDashboard.css";
import logo from './image.png';

export default function OwnerDashboard({ onLogout }) {
  // Get owner name from localStorage
  const ownerData = JSON.parse(localStorage.getItem("worker")) || {};
    const ownerName = ownerData.name || "Owner";
  // CRUD active tab
  const [activeTab, setActiveTab] = useState("");

  // Dashboard stats
  const [stats, setStats] = useState({
    today: { created: 0, updated: 0, total: 0 },
    yesterday: { created: 0, updated: 0, total: 0 },
    dayBefore: { created: 0, updated: 0, total: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Details when clicking stats
  const [details, setDetails] = useState([]);
  const [detailsTitle, setDetailsTitle] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Function to fetch dashboard stats
  const fetchStats = async () => {
    try {
      const res = await API.get("/auth/dashboard-summary-last-3-days");
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats on load
  useEffect(() => {
    fetchStats();
  }, []);

  // Handle toast messages and refresh stats when card created/updated
  const handleSuccess = (message) => {
    toast.success(message, { position: "top-center", autoClose: 2000 });
    setActiveTab(""); // close tab
    fetchStats(); // refresh stats
    if (detailsTitle) {
      // refresh details if a stats card is open
      const [typeText, dayText] = detailsTitle.split(" - ");
      const type = typeText.toLowerCase().includes("created") ? "created"
        : typeText.toLowerCase().includes("updated") ? "updated"
        : "total";
      const day = dayText === "Today" ? "today" : dayText === "Yesterday" ? "yesterday" : "dayBefore";
      fetchDetails(day, type);
    }
  };

  const toggleTab = (tab) => {
    setActiveTab(prev => (prev === tab ? "" : tab));
  };

  // Fetch details when clicking a stats card
  const fetchDetails = async (day, type) => {
    let endpoint = "";
    if (day === "today") {
      if (type === "created") endpoint = "/auth/created/today";
      if (type === "updated") endpoint = "/auth/updated/today";
      if (type === "total") endpoint = "/auth/total/today";
    } else if (day === "yesterday") {
      if (type === "created") endpoint = "/auth/created/yesterday";
      if (type === "updated") endpoint = "/auth/updated/yesterday";
      if (type === "total") endpoint = "/auth/total/yesterday";
    } else if (day === "dayBefore") {
      if (type === "created") endpoint = "/auth/created/day-before";
      if (type === "updated") endpoint = "/auth/updated/day-before";
      if (type === "total") endpoint = "/auth/total/day-before";
    }

    setDetailsLoading(true);
    const dayText = day === "today" ? "Today" : day === "yesterday" ? "Yesterday" : "Day Before Yesterday";
    const typeText = type === "created" ? "Created" : type === "updated" ? "Updated" : "Total Users";
    setDetailsTitle(`${typeText} - ${dayText}`);

    try {
      const res = await API.get(endpoint);
      setDetails(res.data);
    } catch (err) {
      console.error(err);
      setDetails([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const renderStatCard = (day, label, value, type) => (
    <div
      className={`stat-card ${type}`}
      onClick={() => fetchDetails(day, type)}
    >
      {type === "created" && <FaUserClock size={30} />}
      {type === "updated" && <FaUserEdit size={30} />}
      {type === "total" && <FaUsers size={30} />}
      <div>
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );

  return (
    <div className="owner-dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-top">
          <div>
            <p>Owner:</p>
            <h2>{ownerName}</h2>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <h1 className="header-title">Impression Gallery</h1>
        <img src={logo} alt="Shop Logo" className="header-logo" />
        <p className="header-subtitle">
          Manage customer memberships efficiently
        </p>
      </header>

      {/* CRUD Cards Section */}
      <div className="card-section">
        <div className="card-row">
          <div className="card-half">
            <Card
              icon={<FaIdCard size={28} />}
              title="Check Card"
              color="blue"
              active={activeTab === "view"}
              onClick={() => toggleTab("view")}
            />
          </div>
          <div className="card-half">
            <Card
              icon={<FaEdit size={28} />}
              title="Update Card"
              color="yellow"
              active={activeTab === "update"}
              onClick={() => toggleTab("update")}
            />
          </div>
        </div>
        <div className="card-row">
          <div className="card-half">
            <Card
              icon={<FaUserPlus size={28} />}
              title="Create Card"
              color="green"
              active={activeTab === "create"}
              onClick={() => toggleTab("create")}
            />
          </div>
        </div>
      </div>

      {/* Active CRUD Tab */}
      {activeTab && (
        <div className="active-tab-content">
          {activeTab === "create" && <CustomerForm onSuccess={handleSuccess} />}
          {activeTab === "view" && <ViewCard />}
          {activeTab === "update" && <UpdatePurchase onSuccess={handleSuccess} />}
        </div>
      )}

      {/* Owner Stats Dashboard */}
      <div className="owner-stats">
        <h1 className="title">📊 Owner Dashboard</h1>

        {/* Today */}
        <h2>Today</h2>
        <div className="stats-row">
          {renderStatCard("today", "Cards Created", stats.today.created, "created")}
          {renderStatCard("today", "Cards Updated", stats.today.updated, "updated")}
          {renderStatCard("today", "Total Users", stats.today.total, "total")}
        </div>

        {/* Yesterday */}
        <h2>Yesterday</h2>
        <div className="stats-row">
          {renderStatCard("yesterday", "Cards Created", stats.yesterday.created, "created")}
          {renderStatCard("yesterday", "Cards Updated", stats.yesterday.updated, "updated")}
          {renderStatCard("yesterday", "Total Users", stats.yesterday.total, "total")}
        </div>

        {/* Day Before Yesterday */}
        <h2>Day Before Yesterday</h2>
        <div className="stats-row">
          {renderStatCard("dayBefore", "Cards Created", stats.dayBefore.created, "created")}
          {renderStatCard("dayBefore", "Cards Updated", stats.dayBefore.updated, "updated")}
          {renderStatCard("dayBefore", "Total Users", stats.dayBefore.total, "total")}
        </div>

        {/* Details Section */}
        <div className="details-section">
          <h2>{detailsTitle}</h2>
          {detailsLoading ? (
            <p>Loading details...</p>
          ) : details.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="user-list">
              {details.map(user => (
                <li key={user._id}>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Tier:</strong> {user.membershipTier}</p>
                  <p><strong>Purchases:</strong> {user.purchaseCount}</p>
                  <p><strong>Referrals:</strong> {user.referralCount}</p>
                  <p><strong>Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                  {user.cardUrl && <img src={user.cardUrl} alt="Membership QR" className="qr-img" />}
                  <hr />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
