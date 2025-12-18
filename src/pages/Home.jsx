import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Home() {
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
    setPage(key);
    setOpen(false);
  };

  const loadData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/mahasiswa");
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

  const handleAdd = async () => {
    if (!nim || !nama || !prodi) return alert("Semua field wajib diisi!");
    await fetch("http://localhost:5000/api/mahasiswa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nim: nim.toString(), nama, prodi }),
    });
    setNim(""); setNama(""); setProdi("");
    loadData();
  };

  const startEdit = (mhs) => {
    setEditMode(true);
    setEditNIM(mhs.nim);
    setNim(mhs.nim);
    setNama(mhs.nama);
    setProdi(mhs.prodi);
    setPage("input");
  };

  const handleEditSave = async () => {
    await fetch(`http://localhost:5000/api/mahasiswa/${editNIM}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nim: nim.toString(), nama, prodi }),
    });
    setEditMode(false);
    setNim(""); setNama(""); setProdi("");
    loadData();
  };

  const handleDelete = async (nim) => {
    if (!window.confirm("Hapus data ini?")) return;
    await fetch(`http://localhost:5000/api/mahasiswa/${nim}`, { method: "DELETE" });
    loadData();
  };

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:5000/api/mahasiswa/search/${searchNIM}`);
    const json = await res.json();
    setSearchResult(json);
  };

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

        {page === "input" && (
          <div style={centerWrapper}>
            <div style={card}>
              <h2>{editMode ? "Edit Data Mahasiswa" : "Input Data Mahasiswa"}</h2>
              <input style={input} placeholder="NIM" value={nim} onChange={e => setNim(e.target.value)} />
              <input style={input} placeholder="Nama" value={nama} onChange={e => setNama(e.target.value)} />
              <input style={input} placeholder="Program Studi" value={prodi} onChange={e => setProdi(e.target.value)} />
              <button style={btnPrimary} onClick={editMode ? handleEditSave : handleAdd}>
                {editMode ? "Simpan Perubahan" : "Simpan Data"}
              </button>
            </div>
          </div>
        )}

        {page === "view" && (
          <div style={centerWrapper}>
            <div style={card}>
              <h2>Data Mahasiswa</h2>
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

        {page === "sort" && (
          <div style={centerWrapper}>
            <div style={card}>
              <h2>Pengurutan Data</h2>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <button style={btnPrimary} onClick={sortNamaAsc}>Nama A–Z</button>
                <button style={btnInfo} onClick={sortNamaDesc}>Nama Z–A</button>
                <button style={btnPrimary} onClick={sortNimAsc}>NIM ↑</button>
                <button style={btnInfo} onClick={sortNimDesc}>NIM ↓</button>
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

const centerWrapper = {
  minHeight: "80vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const card = {
  background: "#f5daedff",
  padding: "32px",
  borderRadius: "16px",
  maxWidth: "1000px",
  width: "100%",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const input = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1.5px solid #43034bff",
  fontSize: "15px",
  outline: "none",
};

const searchRow = {
  display: "flex",
  gap: "12px",
  alignItems: "stretch",
  marginBottom: "20px",
};

const btnSearch = {
  background: "#ab3189ff",
  color: "#ffffff",
  border: "none",
  padding: "0 26px",
  borderRadius: "10px",
  fontWeight: "600",
  height: "48px",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const th = {
  background: "#4d043aff",
  color: "#ffffff",
  padding: "12px",
  textAlign: "left",
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

const btnPrimary = {
  background: "#ab3189ff",
  color: "#ffffff",
  border: "none",
  padding: "12px 22px",
  borderRadius: "10px",
  fontWeight: "600",
};

const btnInfo = {
  background: "#1e40af",
  color: "#ffffff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  marginRight: "6px",
  fontWeight: "600",
};

const btnDanger = {
  background: "#ef4444",
  color: "#ffffff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  fontWeight: "600",
};

const homeCard = {
  background: "#fcf6faff",
  padding: "40px",
  borderRadius: "20px",
  maxWidth: "1000px",
  margin: "60px auto",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  borderLeft: "8px solid #4a024aff",
};

const homeBox = {
  background: "#eed3eaff",
  padding: "22px",
  borderRadius: "12px",
  marginTop: "20px",
  border: "1px solid #480344ff",
};
