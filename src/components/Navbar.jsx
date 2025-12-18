import React from "react";

export default function Navbar({ onToggle }) {
  return (
    <header style={navbar}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* HAMBURGER MODERN */}
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          style={hamburger}
        >
          <span style={line}></span>
          <span style={line}></span>
          <span style={line}></span>
        </button>

        <h2 style={title}>MANAJEMEN DATA MAHASISWA</h2>
      </div>

      <img
        src="/image/unpam.png"
        alt="Unpam"
        style={logo}
      />
    </header>
  );
}


const navbar = {
  height: "64px",
  background: "linear-gradient(135deg, #09054fff, #a855f7)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 24px",
  boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
};

const title = {
  margin: 0,
  fontSize: "18px",
  fontWeight: 600,
  color: "#ffffff",
  letterSpacing: "0.5px",
};

const hamburger = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  border: "none",
  background: "rgba(255,255,255,0.2)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
};

const line = {
  width: "20px",
  height: "2.5px",
  background: "#ffffff",
  borderRadius: "10px",
};

const logo = {
  width: "48px",
  height: "48px",
  objectFit: "contain",
};
