import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const navigate = useNavigate(); 

  // 🔒 LOGIN PROTECTION
  useEffect(() => {
    if (!localStorage.getItem("login")) {
      navigate("/"); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("login");
    navigate("/"); // kembali ke login
  };

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("Home");

  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editNIM, setEditNIM] = useState("");

  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");

  const [searchNIM, setSearchNIM] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const toggle = () => setOpen(!open);

  const handleSelect = (key) => {
    if (key === "logout") { // 🔑 otomatis logout jika pilih menu logout
      handleLogout();
      return;
    }
    setPage(key);
    setOpen(false);
  };

  // Ganti dengan URL Railway kamu
  const API_URL = "https://sistem-manajemen-mahasiswa-production.up.railway.app";

  const loadData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mahasiswa`);
      const json = await res.json();
      setData(json);
      setSortedData(json);
    } catch {
      alert("Gagal load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ===== ADD =====
  const handleAdd = async () => {
    if (!nim || !nama || !prodi) return alert("Semua field wajib diisi!");
    try {
      await fetch(`${API_URL}/api/mahasiswa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim: nim.toString(), nama, prodi }),
      });
      setNim(""); setNama(""); setProdi("");
      loadData();
    } catch {
      alert("Gagal menambahkan data");
    }
  };

  // ===== EDIT =====
  const startEdit = (mhs) => {
    setEditMode(true);
    setEditNIM(mhs.nim);
    setNim(mhs.nim);
    setNama(mhs.nama);
    setProdi(mhs.prodi);
    setPage("input");
  };

  const handleEditSave = async () => {
    try {
      await fetch(`${API_URL}/api/mahasiswa/${editNIM}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim: nim.toString(), nama, prodi }),
      });
      setEditMode(false);
      setNim(""); setNama(""); setProdi("");
      loadData();
    } catch {
      alert("Gagal update data");
    }
  };

  // ===== DELETE =====
  const handleDelete = async (nim) => {
    if (!window.confirm("Hapus data ini?")) return;
    try {
      await fetch(`${API_URL}/api/mahasiswa/${nim}`, { method: "DELETE" });
      loadData();
    } catch {
      alert("Gagal menghapus data");
    }
  };

  // ===== SEARCH =====
  const handleSearch = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mahasiswa/search/${searchNIM}`);
      const json = await res.json();
      setSearchResult(json);
    } catch {
      alert("Gagal mencari data");
    }
  };

  // ===== SORTING =====
  const sortNamaAsc = () =>
    setSortedData([...data].sort((a, b) => a.nama.localeCompare(b.nama)));
  const sortNamaDesc = () =>
    setSortedData([...data].sort((a, b) => b.nama.localeCompare(a.nama)));
  const sortNimAsc = () =>
    setSortedData([...data].sort((a, b) => Number(a.nim) - Number(b.nim)));
  const sortNimDesc = () =>
    setSortedData([...data].sort((a, b) => Number(b.nim) - Number(a.nim)));

  // ===== EXPORT CSV =====
  const exportCSV = (useSorted = true) => {
    const headers = ["NIM", "Nama", "Prodi"];
    const rows = (useSorted ? sortedData : data).map(item => [item.nim, item.nama, item.prodi]);

    let csvContent = "";
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", useSorted ? "mahasiswa_sorted.csv" : "mahasiswa_all.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar onToggle={toggle} />
      <Sidebar open={open} onSelect={handleSelect} />

      <main style={{ padding: 24, background: "#f1f5f9", minHeight: "100vh", position: "relative" }}>

        {/* 🌸 BACKGROUND BUNGA */}
        <div className="flower-bg">
          <span className="flower">🌸</span>
          <span className="flower">🌼</span>
          <span className="flower">🌸</span>
          <span className="flower">🌼</span>
          <span className="flower">🌸</span>
          <span className="flower">🌼</span>
          <span className="flower">🌺</span>
          <span className="flower">🌸</span>
          <span className="flower">🌼</span>
        </div>

        {/* HOME */}
        {page === "Home" && (
          <div style={homeCard}>
            <h1 style={{ color: "#1e3a8a", marginBottom: 10 }}>
              Sistem Manajemen Data Mahasiswa
            </h1>
            <p style={{ color: "#475569", fontSize: 18 }}>
              Aplikasi berbasis web untuk pengelolaan data mahasiswa secara rapi dan terstruktur.
            </p>
            <div style={homeBox}>
              <strong>Petunjuk Penggunaan:</strong>
              <ul style={{ marginTop: 10, lineHeight: 1.8 }}>
                <li>Tambah data mahasiswa melalui menu Input Data</li>
                <li>Edit dan hapus data di menu Lihat Data</li>
                <li>Cari mahasiswa berdasarkan NIM</li>
                <li>Gunakan fitur pengurutan data</li>
              </ul>
            </div>
          </div>
        )}

        {/* INPUT DATA */}
        {page === "input" && (
          <div style={centerWrapper}>
            <div style={card}>
              <h2>{editMode ? "Edit Data Mahasiswa" : "Input Data Mahasiswa"}</h2>

              {/* NIM hanya angka */}
              <input
                style={input}
                placeholder="NIM"
                value={nim}
                onChange={e => setNim(e.target.value)}
                onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
              />

              {/* Nama hanya huruf */}
              <input
                style={input}
                placeholder="Nama"
                value={nama}
                onChange={e => setNama(e.target.value)}
                onKeyPress={e => { if (!/[a-zA-Z\s]/.test(e.key)) e.preventDefault(); }}
              />

              {/* Prodi hanya huruf */}
              <input
                style={input}
                placeholder="Program Studi"
                value={prodi}
                onChange={e => setProdi(e.target.value)}
                onKeyPress={e => { if (!/[a-zA-Z\s]/.test(e.key)) e.preventDefault(); }}
              />

              <button style={btnPrimary} onClick={editMode ? handleEditSave : handleAdd}>
                {editMode ? "Simpan Perubahan" : "Simpan Data"}
              </button>
            </div>
          </div>
        )}

        {/* LIHAT DATA */}
        {page === "view" && (
          <div style={centerWrapper}>
            <div style={card}>
              <h2>Data Mahasiswa</h2>

              {/* Tombol Export CSV */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <button style={btnPrimary} onClick={() => exportCSV(false)}>Export CSV</button>
              </div>

              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>NIM</th>
                    <th style={th}>Nama</th>
                    <th style={th}>Prodi</th>
                    <th style={th}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(m => (
                    <tr key={m.nim}>
                      <td style={td}>{m.nim}</td>
                      <td style={td}>{m.nama}</td>
                      <td style={td}>{m.prodi}</td>
                      <td style={td}>
                        <button style={btnInfo} onClick={() => startEdit(m)}>Edit</button>
                        <button style={btnDanger} onClick={() => handleDelete(m.nim)}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEARCH */}
        {page === "search" && (
          <div style={centerWrapper}>
            <div style={card}>
              <h2>Pencarian Mahasiswa (NIM)</h2>
              <div style={searchRow}>
                <input
                  style={{ ...input, height: "48px", marginBottom: 0 }}
                  placeholder="Masukkan NIM"
                  value={searchNIM}
                  onChange={e => setSearchNIM(e.target.value)}
                />
                <button style={btnSearch} onClick={handleSearch}>Cari</button>
              </div>
              <table style={table}>
                <tbody>
                  {searchResult.map(m => (
                    <tr key={m.nim}>
                      <td style={td}>{m.nim}</td>
                      <td style={td}>{m.nama}</td>
                      <td style={td}>{m.prodi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SORTING */}
        {page === "sort" && (
          <div style={centerWrapper}>
            <div style={card}>
              <h2>Pengurutan Data</h2>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <button style={btnPrimary} onClick={sortNamaAsc}>Ascending (A - Z)</button>
                <button style={btnInfo} onClick={sortNamaDesc}>Descending (Z–A)</button>
                <button style={btnPrimary} onClick={sortNimAsc}>NIM ⬆️</button>
                <button style={btnInfo} onClick={sortNimDesc}>NIM ⬇️</button>
                <button style={btnPrimary} onClick={() => exportCSV(true)}>Export CSV</button>
              </div>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>NIM</th>
                    <th style={th}>Nama</th>
                    <th style={th}>Prodi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map(m => (
                    <tr key={m.nim}>
                      <td style={td}>{m.nim}</td>
                      <td style={td}>{m.nama}</td>
                      <td style={td}>{m.prodi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page === "logout" && (
          <div style={centerWrapper}>
            <div style={card}>
              <h2>Keluar Aplikasi</h2>
              <p style={{ marginTop: 12, fontSize: 16, color: "#374151" }}>
                Kamu telah selesai menggunakan
                <b> Sistem Manajemen Data Mahasiswa</b>.
              </p>
              <div
                style={{
                  marginTop: 24,
                  padding: "20px",
                  borderRadius: "14px",
                  background: "#ffffff",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  borderLeft: "6px solid #ab3189ff",
                }}
              >
                <p style={{ margin: 0, lineHeight: 1.7, color: "#374151" }}>
                  Terima kasih telah mencoba aplikasi ini !.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}

/* ===== STYLE ===== */
const centerWrapper = { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" };
const card = { background: "#f5daedff", padding: "32px", borderRadius: "16px", maxWidth: "1000px", width: "100%", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" };
const input = { width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1.5px solid #43034bff", fontSize: "15px", outline: "none" };
const searchRow = { display: "flex", gap: "12px", alignItems: "stretch", marginBottom: "20px" };
const btnSearch = { background: "#ab3189ff", color: "#ffffff", border: "none", padding: "0 26px", borderRadius: "10px", fontWeight: "600", height: "48px", cursor: "pointer" };
const table = { width: "100%", borderCollapse: "collapse", marginTop: "20px" };
const th = { background: "#4d043aff", color: "#ffffff", padding: "12px", textAlign: "left" };
const td = { padding: "12px", borderBottom: "1px solid #e5e7eb" };
const btnPrimary = { background: "#ab3189ff", color: "#ffffff", border: "none", padding: "12px 22px", borderRadius: "10px", fontWeight: "600" };
const btnInfo = { background: "#1e40af", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "8px", marginRight: "6px", fontWeight: "600" };
const btnDanger = { background: "#ef4444", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: "600" };
const homeCard = { background: "#fcf6faff", padding: "40px", borderRadius: "20px", maxWidth: "1000px", margin: "60px auto", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", borderLeft: "8px solid #4a024aff" };
const homeBox = { background: "#eed3eaff", padding: "22px", borderRadius: "12px", marginTop: "20px", border: "1px solid #480344ff" };
