import React from "react";

export default function Sidebar({ open, onSelect }) {

  const handleClick = (e, page) => {
    const item = e.currentTarget;

    onSelect(page);

    item.classList.add("glow");
    setTimeout(() => {
      item.classList.remove("glow");
    }, 300);
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <h3 style={{ marginTop: 0, marginBottom: 14, textAlign: "center" }}>
        Menu
      </h3>
      <ul>
        <li onClick={() => onSelect("Home")}>Home</li>
      </ul>
      <div style={{ marginTop: "auto" }}>
        <button
          className="logout-btn"
          onClick={() => onSelect("logout")}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
