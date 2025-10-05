import { useState } from "react";
import API from "../api/api";
import "./verify.css"; // ✅ Import CSS

export default function Verify({ email, onLogin }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      const res = await API.post("/auth/verify", { email, code });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Update App state to trigger dashboard render
      onLogin(res.data.worker);

    } catch (err) {
      setError(err.response?.data?.msg || "Verification failed");
    }
  };

  return (
    <div className="verify-container">
      <h2>Enter Verification Code</h2>
      {error && <p className="verify-error">{error}</p>}
      <input
        placeholder="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleVerify}>Verify & Login</button>
    </div>
  );
}
