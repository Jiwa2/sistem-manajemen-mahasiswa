const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// ===== CORS (FIX VERCEL) =====
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors());

// ===== BODY PARSER =====
app.use(express.json());

// ===== PATH DATA =====
const file = path.join(__dirname, "data", "mahasiswa.json");

function loadData() {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, "[]");
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ===== ROUTES =====
app.get("/api/mahasiswa", (req, res) => {
  res.json(loadData());
});

app.post("/api/mahasiswa", (req, res) => {
  const { nim, nama, prodi } = req.body;
  if (!nim || !nama || !prodi) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const data = loadData();
  if (data.find(m => m.nim === String(nim))) {
    return res.status(400).json({ message: "NIM sudah terdaftar" });
  }

  const mhs = { nim: String(nim), nama, prodi };
  data.push(mhs);
  saveData(data);

  res.json({ message: "OK", data: mhs });
});

app.put("/api/mahasiswa/:nim", (req, res) => {
  const { nama, prodi } = req.body;
  const nim = String(req.params.nim);

  const data = loadData();
  const idx = data.findIndex(m => m.nim === nim);
  if (idx === -1) {
    return res.status(404).json({ message: "Data tidak ditemukan" });
  }

  data[idx].nama = nama;
  data[idx].prodi = prodi;
  saveData(data);

  res.json({ message: "Updated", data: data[idx] });
});

app.delete("/api/mahasiswa/:nim", (req, res) => {
  const nim = String(req.params.nim);
  const data = loadData().filter(m => m.nim !== nim);
  saveData(data);
  res.json({ message: "Deleted" });
});

app.get("/api/mahasiswa/search/:nim", (req, res) => {
  const nim = String(req.params.nim);
  res.json(loadData().filter(m => m.nim.includes(nim)));
});

// ===== START SERVER (INI KRUSIAL) =====
const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
