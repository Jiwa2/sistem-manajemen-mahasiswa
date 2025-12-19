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
        <h2 style={title}>Selamat Datang</h2>
        <p style={subtitle}>Masuk ke Sistem Manajemen Mahasiswa</p>

        <form onSubmit={handleLogin}>
          <div style={inputGroup}>
            <input
              style={input}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={inputGroup}>
            <input
              style={input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button style={button} type="submit">
            Masuk
          </button>
        </form>

        <p style={footer}>© 2025 Manajemen Mahasiswa</p>
      </div>
    </div>
  );
}

/* ===== STYLE ===== */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #6e44ff, #d8b4fe)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const card = {
  background: "#ffffff",
  padding: "40px 32px",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.9), 0 10px 10px rgba(0,0,0,0.9)",
  textAlign: "center",
  transition: "transform 0.3s",
};


const title = {
  marginBottom: "8px",
  fontSize: "30px",
  fontWeight: "700",
  color: "#4b06ff",
};

const subtitle = {
  marginBottom: "28px",
  fontSize: "15px",
  color: "#6b7280",
};

const inputGroup = {
  marginBottom: "20px",
};

const input = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "2px solid #dcd6f7",
  fontSize: "15px",
  outline: "none",
  transition: "0.3s",
};

input.focus = {
  borderColor: "#6e44ff",
  boxShadow: "0 0 8px rgba(110, 68, 255, 0.3)",
};

const button = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #6e44ff, #a855f7)",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "0.3s",
};

button.hover = {
  transform: "translateY(-2px)",
  boxShadow: "0 8px 20px rgba(110, 68, 255, 0.4)",
};

const footer = {
  marginTop: "24px",
  fontSize: "12px",
  color: "#9ca3af",
};
