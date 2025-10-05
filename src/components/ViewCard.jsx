import { useState } from "react";
import API from "../api/api";
import "./ViewCard.css";

export default function ViewCard() {
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [card, setCard] = useState(null);
  const [error, setError] = useState("");

  const fetchCard = async () => {
    try {
      const res = await API.get("/customer/card", {
        params: { phone, dob }
      });
      setCard(res.data.cardDetails);
      setError("");
    } catch(err) {
      setError(err.response?.data?.msg || "Error fetching card");
      setCard(null);
    }
  }

  return (
    <div className="view-card-container">
      <h2>View Membership Card</h2>
      <input
        placeholder="Phone"
        value={phone}
        

        onChange={e =>{ const value = e.target.value;
              if (value.length <= 10) setPhone(e.target.value)}}
      />
      <input
        type="date"
        value={dob}
        onChange={e => setDob(e.target.value)}
      />
      <button onClick={fetchCard}>Get Card</button>

      {error && <p className="error">{error}</p>}

      {card && (
        <div className="card-details">
          <h3>{card.name}</h3>
          <p>Tier: {card.membershipTier}</p>
          <p>Expiry: {new Date(card.cardExpiry).toDateString()}</p>
          <img src={card.cardUrl} alt="QR Code"/>
        </div>
      )}
    </div>
  )
}
