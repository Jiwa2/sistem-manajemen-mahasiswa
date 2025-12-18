const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// ===== CORS =====
app.use(cors({ origin: "*" }));
app.options("*", cors({ origin: "*" }));

app.use(express.json());

// ===== FILE DATA =====
const file = path.join(__dirname, "./data/mahasiswa.json");

function loadData() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");
  return JSON.parse(fs.readFileSync(file));
}

function saveData(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ===== ROUTES =====
app.get("/api/mahasiswa", (req, res) => res.json(loadData()));
app.post("/api/mahasiswa", (req, res) => {
  const { nim, nama, prodi } = req.body;
  if (!nim || !nama || !prodi) return res.status(400).json({ message: "Data tidak lengkap" });

  const data = loadData();
  if (data.find(m => m.nim === String(nim))) return res.status(400).json({ message: "NIM sudah terdaftar" });

  const mhs = { nim: String(nim), nama, prodi };
  data.push(mhs);
  saveData(data);
  res.json({ message: "Data ditambahkan", data: mhs });
});

app.put("/api/mahasiswa/:nim", (req, res) => {
  const nim = String(req.params.nim);
  const { nama, prodi } = req.body;
  const data = loadData();
  const index = data.findIndex(m => m.nim === nim);
  if (index === -1) return res.status(404).json({ message: "Data tidak ditemukan" });

  data[index].nama = nama;
  data[index].prodi = prodi;
  saveData(data);
  res.json({ message: "Data berhasil diupdate", data: data[index] });
});

app.delete("/api/mahasiswa/:nim", (req, res) => {
  const nim = String(req.params.nim);
  const data = loadData();
  const newList = data.filter(m => m.nim !== nim);
  if (newList.length === data.length) return res.status(404).json({ message: "Data tidak ditemukan" });

  saveData(newList);
  res.json({ message: "Data berhasil dihapus" });
});

app.get("/api/mahasiswa/search/:nim", (req, res) => {
  const nim = String(req.params.nim);
  const data = loadData();
  const result = data.filter(m => m.nim.includes(nim));
  res.json(result);
});

// ===== START SERVER =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port " + PORT));
