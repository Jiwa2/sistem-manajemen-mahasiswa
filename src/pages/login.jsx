import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123") {
      localStorage.setItem("login", "true");
      navigate("/home");
    } else {
      alert("Username atau password salah");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>Login Admin</h2>
        <p style={subtitle}>Sistem Manajemen Data Mahasiswa</p>

        <form onSubmit={handleLogin}>
          <input
            style={input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={button} type="submit">
            Masuk
          </button>
        </form>

        <p style={footer}>© 2025 Manajemen Mahasiswa</p>
      </div>
    </div>
  );
}

/* ===== STYLE (TEMA UNGU) ===== */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #4a044eff, #a855f7)",
};

const card = {
  background: "#ffffff",
  padding: "36px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  textAlign: "center",
};

const title = {
  marginBottom: "6px",
  fontSize: "28px",
  fontWeight: "700",
  color: "#131D78",
};

const subtitle = {
  marginBottom: "22px",
  fontSize: "14px",
  color: "#6b7280",
};

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1.8px solid #c084fc",
  fontSize: "15px",
  outline: "none",
};

const button = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #131D78, #131D78)",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

const footer = {
  marginTop: "20px",
  fontSize: "12px",
  color: "#9ca3af",
};
