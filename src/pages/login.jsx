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
      {/* ⭐ STARS */}
      <div style={stars}></div>
      <div style={stars2}></div>

      {/* 🦋 BUTTERFLIES */}
      <div className="butterfly b1">🦋</div>
      <div className="butterfly b2">🦋</div>
      <div className="butterfly b3">🦋</div>
      <div className="butterfly b4">🦋</div>
      <div className="butterfly b5">🦋</div>
      <div className="butterfly b6">🦋</div>
      <div className="butterfly b7">🦋</div>

      <div style={card}>
        <h2 style={title}>Hi, Welcome 💜</h2>
        <p style={subtitle}>Masuk ke Sistem Manajemen Mahasiswa</p>

        <form onSubmit={handleLogin}>
          <input
            style={input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={button}>Login ✨</button>
        </form>

        <p style={footer}>© 2025 Manajemen Mahasiswa</p>
      </div>

      <style>{css}</style>
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
  fontFamily: "'Poppins', sans-serif",
  position: "relative",
  overflow: "hidden",
};

const card = {
  background: "rgba(255,255,255,0.97)",
  padding: "42px 32px",
  borderRadius: "28px",
  width: "90%",
  maxWidth: "380px",
  textAlign: "center",
  zIndex: 10,

  /* 💜 SHADOW + GLOW DI PINGGIR CARD */
  boxShadow: `
    0 0 0 3px rgba(48, 43, 54, 0.35),      /* outline glow */
    0 0 40px rgba(0, 0, 0, 0.45),       /* outer glow */
    0 25px 80px rgba(0, 0, 0, 0.25)          /* drop shadow */
  `,
};


const title = {
  fontSize: "30px",
  fontWeight: "700",
  color: "#6e44ff",
};

const subtitle = {
  fontSize: "14px",
  marginBottom: "26px",
  color: "#6b7280",
};

const input = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "18px",
  borderRadius: "14px",
  border: "2px solid #e9d5ff",
  fontSize: "15px",
  outline: "none",
};

const button = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #6e44ff, #a855f7)",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};

const footer = {
  marginTop: "22px",
  fontSize: "12px",
  color: "#9ca3af",
};

/* ⭐ STARS */
const stars = {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(white 1px, transparent 1px)",
  backgroundSize: "50px 50px",
  animation: "twinkle 20s linear infinite",
  opacity: 0.4,
};

const stars2 = {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(white 1px, transparent 1px)",
  backgroundSize: "80px 80px",
  animation: "twinkle 40s linear infinite",
  opacity: 0.2,
};

/* 🦋 CSS ANIMATION */
const css = `
@keyframes twinkle {
  from { transform: translateY(0); }
  to { transform: translateY(-200px); }
}

.butterfly {
  position: absolute;
  left: -10%;
  font-size: 26px;
  animation: fly 14s linear infinite;
  z-index: 6;
  opacity: 0;
}

.b1 { top: 15%; animation-delay: 0s; }
.b2 { top: 30%; animation-delay: 2s; }
.b3 { top: 45%; animation-delay: 4s; }
.b4 { top: 60%; animation-delay: 6s; }
.b5 { top: 75%; animation-delay: 8s; }
.b6 { top: 25%; animation-delay: 10s; }
.b7 { top: 50%; animation-delay: 12s; }

@keyframes fly {
  0% {
    transform: translateX(0) translateY(0) scale(0.9);
    opacity: 0;
  }
  10% { opacity: 1; }
  100% {
    transform: translateX(120vw) translateY(-100px) scale(1.1);
    opacity: 0;
  }
}
`;
