import React from "react";
import "./Card.css";

export default function Card({ icon, title, color, active, onClick }) {
  const bgClass = active ? color : "default";
  const activeClass = active ? "active" : "";

  return (
    <div className={`card ${bgClass} ${activeClass}`} onClick={onClick}>
      <div className="icon">{icon}</div>
      <h3 className="title">{title}</h3>
    </div>
  );
}
