import { useState } from "react";
import API from "../api/api";
import Verify from "./verify";
import "./Login.css"; // ✅ Import CSS

export default function Loginn({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/login", { email, password });
      setStep(2); // show verify page
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="login-container">
      {step === 1 && (
        <form onSubmit={handleLogin}>
          <h2>Employee Login</h2>
          {error && <p className="login-error">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Send Verification Code</button>
        </form>
      )}

      {step === 2 && <Verify email={email} onLogin={onLogin} />}
    </div>
  );
}
