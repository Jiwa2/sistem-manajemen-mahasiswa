import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const navigate = useNavigate();

  /* ================= LOGIN PROTECTION ================= */
  useEffect(() => {
    if (!localStorage.getItem("login")) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("login");
    navigate("/");
  };
  /* =================================================== */

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
    if (key === "logout") {
      handleLogout();
      return;
    }
    setPage(key);
    setOpen(false);
  };

  /* ================= API ================= */
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

  /* ===== ADD ===== */
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

  /* ===== EDIT ===== */
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

  /* ===== DELETE ===== */
  const handleDelete = async (nim) => {
    if (!window.confirm("Hapus data ini?")) return;
    try {
      await fetch(`${API_URL}/api/mahasiswa/${nim}`, { method: "DELETE" });
      loadData();
    } catch {
      alert("Gagal menghapus data");
    }
  };

  /* ===== SEARCH ===== */
  const handleSearch = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mahasiswa/search/${searchNIM}`);
      const json = await res.json();
      setSearchResult(json);
    } catch {
      alert("Gagal mencari data");
    }
  };

  /* ===== SORT ===== */
  const sortNamaAsc = () =>
    setSortedData([...data].sort((a, b) => a.nama.localeCompare(b.nama)));
  const sortNamaDesc = () =>
    setSortedData([...data].sort((a, b) => b.nama.localeCompare(a.nama)));
  const sortNimAsc = () =>
    setSortedData([...data].sort((a, b) => Number(a.nim) - Number(b.nim)));
  const sortNimDesc = () =>
    setSortedData([...data].sort((a, b) => Number(b.nim) - Number(a.nim)));

  return (
    <>
      <Navbar onToggle={toggle} />
      <Sidebar open={open} onSelect={handleSelect} />

      <main style={{ padding: 24, background: "#f1f5f9", minHeight: "100vh" }}>

        {/* HOME */}
        {page === "Home" && (
          <div style={homeCard}>
            <h1>Sistem Manajemen Data Mahasiswa</h1>
            <p>Aplikasi berbasis web untuk pengelolaan data mahasiswa.</p>
          </div>
        )}

        {/* INPUT */}
        {page === "input" && (
          <div style={card}>
            <h2>{editMode ? "Edit Data Mahasiswa" : "Input Data Mahasiswa"}</h2>
            <input style={input} placeholder="NIM" value={nim} onChange={e => setNim(e.target.value)} />
            <input style={input} placeholder="Nama" value={nama} onChange={e => setNama(e.target.value)} />
            <input style={input} placeholder="Prodi" value={prodi} onChange={e => setProdi(e.target.value)} />
            <button style={btnPrimary} onClick={editMode ? handleEditSave : handleAdd}>
              {editMode ? "Simpan Perubahan" : "Simpan Data"}
            </button>
          </div>
        )}

        {/* VIEW */}
        {page === "view" && (
          <div style={card}>
            <h2>Data Mahasiswa</h2>
            <table style={table}>
              <thead>
                <tr><th>NIM</th><th>Nama</th><th>Prodi</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {data.map(m => (
                  <tr key={m.nim}>
                    <td>{m.nim}</td>
                    <td>{m.nama}</td>
                    <td>{m.prodi}</td>
                    <td>
                      <button style={btnInfo} onClick={() => startEdit(m)}>Edit</button>
                      <button style={btnDanger} onClick={() => handleDelete(m.nim)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SEARCH */}
        {page === "search" && (
          <div style={card}>
            <h2>Cari Mahasiswa</h2>
            <input style={input} value={searchNIM} onChange={e => setSearchNIM(e.target.value)} />
            <button style={btnPrimary} onClick={handleSearch}>Cari</button>
            {searchResult.map(m => (
              <p key={m.nim}>{m.nim} - {m.nama}</p>
            ))}
          </div>
        )}

        {/* SORT */}
        {page === "sort" && (
          <div style={card}>
            <button style={btnPrimary} onClick={sortNamaAsc}>Nama A-Z</button>
            <button style={btnInfo} onClick={sortNamaDesc}>Nama Z-A</button>
            <button style={btnPrimary} onClick={sortNimAsc}>NIM ↑</button>
            <button style={btnInfo} onClick={sortNimDesc}>NIM ↓</button>
          </div>
        )}

      </main>
    </>
  );
}

/* ===== STYLE ===== */
const card = { background: "#fff", padding: 24, borderRadius: 12, marginBottom: 20 };
const input = { width: "100%", padding: 10, marginBottom: 10 };
const table = { width: "100%", borderCollapse: "collapse" };
const btnPrimary = { background: "#ab3189", color: "#fff", padding: "10px 18px", marginRight: 6 };
const btnInfo = { background: "#1e40af", color: "#fff", padding: "8px 14px", marginRight: 6 };
const btnDanger = { background: "#ef4444", color: "#fff", padding: "8px 14px" };
const homeCard = { background: "#fff", padding: 40, borderRadius: 14 };
