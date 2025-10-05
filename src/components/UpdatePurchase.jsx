import { useState } from "react";
import API from "../api/api";
import "./UpdatePurchase.css";

export default function UpdatePurchase({ onSuccess }) {
  const [input, setInput] = useState({ email: "", phone: "", id: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setInput(prev => ({
      email: name === "email" ? value : prev.email && !value ? prev.email : "",
      phone: name === "phone" ? value : prev.phone && !value ? prev.phone : "",
      id: name === "id" ? value : prev.id && !value ? prev.id : "",
    }));
  };

  // Get only the filled field
  const getFilledField = () => {
    const filled = {};
    Object.keys(input).forEach(key => {
      if (input[key].trim() !== "") filled[key] = input[key].trim();
    });
    return filled;
  };

  const handleSubmit = async (type) => {
    const data = getFilledField();
    if (!Object.keys(data).length) {
      setMessage("Please fill one field.");
      return;
    }

    try {
      const res = await API.put(
        type === "purchase" ? "/customers/purchase" : "/customers/referral",
        data
      );
      setMessage(res.data.msg);
      onSuccess && onSuccess(res.data.msg); // send to Dashboard toast
      setInput({ email: "", phone: "", id: "" }); // reset inputs
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error");
    }
  };

  const filledField = Object.keys(input).find(key => input[key].trim() !== "");

  return (
    <div className="update-purchase-container">
      {message && <p className="update-purchase-message">{message}</p>}

      <h2>Update Card</h2>
      <h3>(Enter any one detail)</h3>
      <input
        placeholder="Email"
        name="email"
        type="email"
        onChange={handleChange}
        value={input.email}
        disabled={filledField && filledField !== "email"}
      />
      <input
        placeholder="Phone"
        name="phone"
        type="tel"
        onChange={(e) => {
        const value = e.target.value;
          if (value.length <= 10) handleChange(e);
        }}
        value={input.phone}
        disabled={filledField && filledField !== "phone"}
      />
      <input
        placeholder="ID"
        name="id"
        onChange={handleChange}
        value={input.id}
        disabled={filledField && filledField !== "id"}
      />
      <button onClick={() => handleSubmit("purchase")}>Update Purchase</button>
      <button onClick={() => handleSubmit("referral")}>Update Referral</button>
    </div>
  );
}
