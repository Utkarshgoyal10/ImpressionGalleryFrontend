// client/src/components/EnableNotifications.jsx
import React, { useState } from "react";
import { requestNotificationPermission } from "../firebase";

const EnableNotifications = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleEnableNotifications = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    const token = await requestNotificationPermission();
    if (token) {
        console.log("Sending to backend:", { email, token });
      // Send email + FCM token to backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/customers/save-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      if (response.ok) {
        alert("✅ Notifications Enabled");
        setSubscribed(true);
      } else {
        alert("❌ Failed to save token");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>Enable Push Notifications</h2>
      <h5 style={{ padding: "0px 0px 10px 5px" }}>Enter email if visiting first time</h5>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={subscribed}
        style={{ padding: 10, width: "100%", marginBottom: 10 }}
      />
      <button
        onClick={handleEnableNotifications}
        disabled={subscribed}
        style={{ padding: 10, width: "100%", cursor: "pointer" }}
      >
        {subscribed ? "✅ Notifications Enabled" : "🔔 Enable Notifications"}
      </button>
    </div>
  );
};

export default EnableNotifications;
