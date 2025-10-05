import { useState } from "react";
import API from "../api/api";
import "./CustomerFormm.css"; // CSS file for styling

export default function CustomerFormm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    anniversary: "",
    referredBy: ""
  });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePhoto = (e) => setPhoto(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (photo) data.append("photo", photo);

      await API.post("/customers", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage("Customer created successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        dob: "",
        anniversary: "",
        referredBy: ""
      });
      setPhoto(null);

      if (onSuccess) onSuccess("Card created successfully!");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error creating customer");
    }
  };

  return (
    <div className="customer-form-container">
      {message && <p className="customer-form-message">{message}</p>}
      <h2>Add New Customer</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="email">Email
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="phone">Phone
          <input
            id="phone"
            name="phone"
            type="number"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 10) handleChange(e);
            }}
            required
          />
        </label>

        <div className="form-row">
          <div className="form-col">
            <label htmlFor="dob">Date of Birth
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-col">
            <label htmlFor="anniversary">Anniversary
              <input
                id="anniversary"
                name="anniversary"
                type="date"
                value={formData.anniversary}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <label htmlFor="referredBy">Referral Code
          <input
            id="referredBy"
            name="referredBy"
            type="number"
            placeholder="Enter referral code"
            value={formData.referredBy}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 10) handleChange(e);
            }}
          />
        </label>

        <label htmlFor="photo">Profile Photo
          <input id="photo" type="file" onChange={handlePhoto} />
        </label>

        <button type="submit">Create Customer</button>
      </form>
    </div>
  );
}
