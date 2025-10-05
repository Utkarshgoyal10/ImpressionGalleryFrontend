import { useState } from "react";
import { FaUserPlus, FaIdCard, FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CustomerForm from "./CustomerFormm";
import ViewCard from "./ViewCard";
import UpdatePurchase from "./UpdatePurchase";
import Card from "./card";
import "./Dashboard.css";
import logo from './image.png';

export default function Dashboard({ worker, onLogout }) {
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSuccess = (message) => {
    toast.success(message, { position: "top-center", autoClose: 2000 });
    setActiveTab(""); // close section after success
  };

  // Toggle card open/close
  const toggleTab = (tab) => {
    setActiveTab(prev => (prev === tab ? "" : tab));
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-top">
          <div>
            <p>Employee:</p>
            <h2>{worker?.name || "Worker"}</h2>
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

      {/* Cards Section */}
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

      {/* Active Tab Content */}
      <div className={`active-tab-content ${activeTab ? "visible" : "hidden"}`}>
        {activeTab === "create" && (
          <CustomerForm onSuccess={handleSuccess} />
        )}

        {activeTab === "view" && (
            <ViewCard searchQuery={searchQuery} />
        )}

        {activeTab === "update" && (
          <UpdatePurchase onSuccess={handleSuccess} />
        )}

        {!activeTab && (
          <p style={{ color: "#9ca3af", textAlign: "center" }}>
            Select an action card above to manage customer data.
          </p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
