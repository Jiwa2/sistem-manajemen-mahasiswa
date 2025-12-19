import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const navigate = useNavigate(); 

  // 🔒 LOGIN PROTECTION
  useEffect(() => { if (!localStorage.getItem("login")) navigate("/"); }, [navigate]);

  const handleLogout = () => { localStorage.removeItem("login"); navigate("/"); };
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editNIM, setEditNIM] = useState("");

  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");

  const [searchNIM, setSearchNIM] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const API_URL = "https://sistem-manajemen-mahasiswa-production.up.railway.app";

  // ===== LOAD DATA =====
  const loadData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mahasiswa`);
      const json = await res.json();
      setData(json);
      setSortedData(json); // pastikan sortedData selalu update
    } catch { alert("Gagal load data"); }
  };
  useEffect(() => { loadData(); }, []);

  // ===== ADD / EDIT =====
  const handleAdd = async () => {
    if (!nim || !nama || !prodi) return alert("Semua field wajib diisi!");
    try {
      await fetch(`${API_URL}/api/mahasiswa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim: nim.toString(), nama, prodi }),
      });
      setNim(""); setNama(""); setProdi(""); loadData();
    } catch { alert("Gagal menambahkan data"); }
  };
  const startEdit = (mhs) => { setEditMode(true); setEditNIM(mhs.nim); setNim(mhs.nim); setNama(mhs.nama); setProdi(mhs.prodi); };
  const handleEditSave = async () => {
    try {
      await fetch(`${API_URL}/api/mahasiswa/${editNIM}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim: nim.toString(), nama, prodi }),
      });
      setEditMode(false); setNim(""); setNama(""); setProdi(""); loadData();
    } catch { alert("Gagal update data"); }
  };

  // ===== DELETE =====
  const handleDelete = async (nim) => {
    if (!window.confirm("Hapus data ini?")) return;
    try { await fetch(`${API_URL}/api/mahasiswa/${nim}`, { method: "DELETE" }); loadData(); }
    catch { alert("Gagal menghapus data"); }
  };

  // ===== SEARCH =====
  const handleSearch = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mahasiswa/search/${searchNIM}`);
      const json = await res.json();
      setSearchResult(json);
    } catch { alert("Gagal mencari data"); }
  };

  // ===== SORTING =====
  const sortNamaAsc = () => setSortedData([...data].sort((a,b)=>a.nama.localeCompare(b.nama)));
  const sortNamaDesc = () => setSortedData([...data].sort((a,b)=>b.nama.localeCompare(a.nama)));
  const sortNimAsc = () => setSortedData([...data].sort((a,b)=>Number(a.nim)-Number(b.nim)));
  const sortNimDesc = () => setSortedData([...data].sort((a,b)=>Number(b.nim)-Number(a.nim)));

  // ===== EXPORT CSV =====
  const exportCSV = (useSorted=true) => {
    const headers = ["NIM","Nama","Prodi"];
    const rows = (useSorted ? sortedData : data).map(i => [i.nim,i.nama,i.prodi]);
    let csvContent = headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", useSorted ? "mahasiswa_sorted.csv" : "mahasiswa_all.csv");
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <>
      <Navbar onToggle={toggle} />
      <Sidebar open={open} onSelect={(key)=>key==="logout"?handleLogout():null} />

      <main style={{ padding:24, background:"#f1f5f9", minHeight:"100vh" }}>
        {/* 🌸 FLOWERS */}
        <div className="flower-bg">
          <span className="flower">🌸</span>
          <span className="flower">🌼</span>
          <span className="flower">🌺</span>
        </div>

        {/* ===== INPUT DATA CARD ===== */}
        <div style={sectionCard}>
          <h2>{editMode?"Edit Data Mahasiswa":"Input Data Mahasiswa"}</h2>
          <input
            style={input} placeholder="NIM" value={nim}
            onChange={e=>setNim(e.target.value)}
            onKeyPress={e=>{
              if(!/[0-9]/.test(e.key)){
                e.preventDefault();
                alert("NIM hanya boleh angka!");
              }
            }}
          />
          <input
            style={input} placeholder="Nama" value={nama}
            onChange={e=>setNama(e.target.value)}
            onKeyPress={e=>{
              if(!/[a-zA-Z\s]/.test(e.key)){
                e.preventDefault();
                alert("Nama hanya boleh huruf!");
              }
            }}
          />
          <input
            style={input} placeholder="Program Studi" value={prodi}
            onChange={e=>setProdi(e.target.value)}
            onKeyPress={e=>{
              if(!/[a-zA-Z\s]/.test(e.key)){
                e.preventDefault();
                alert("Program Studi hanya boleh huruf!");
              }
            }}
          />
          <button style={btnPrimary} onClick={editMode?handleEditSave:handleAdd}>{editMode?"Simpan Perubahan":"Simpan Data"}</button>
        </div>

        {/* ===== VIEW & SEARCH CARD ===== */}
        <div style={sectionCard}>
          <h2>Data Mahasiswa</h2>
          <div style={{display:"flex", marginBottom:12, gap:10}}>
            <input style={{...input, flex:1}} placeholder="Cari NIM" value={searchNIM} onChange={e=>setSearchNIM(e.target.value)} />
            <button style={btnSearch} onClick={handleSearch}>Cari</button>
            <button style={btnPrimary} onClick={()=>exportCSV(false)}>Export CSV</button>
          </div>
          <table style={table}>
            <thead><tr><th>NIM</th><th>Nama</th><th>Prodi</th><th>Aksi</th></tr></thead>
            <tbody>
              {(searchNIM?searchResult:sortedData).map(m=>(
                <tr key={m.nim}>
                  <td>{m.nim}</td>
                  <td>{m.nama}</td>
                  <td>{m.prodi}</td>
                  <td>
                    <button style={btnInfo} onClick={()=>startEdit(m)}>Edit</button>
                    <button style={btnDanger} onClick={()=>handleDelete(m.nim)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== SORTING CARD ===== */}
        <div style={sectionCard}>
          <h2>Pengurutan Data</h2>
          <div style={{display:"flex", gap:10, flexWrap:"wrap", marginBottom:16}}>
            <button style={btnPrimary} onClick={sortNamaAsc}>Nama A-Z</button>
            <button style={btnInfo} onClick={sortNamaDesc}>Nama Z-A</button>
            <button style={btnPrimary} onClick={sortNimAsc}>NIM ⬆️</button>
            <button style={btnInfo} onClick={sortNimDesc}>NIM ⬇️</button>
            <button style={btnPrimary} onClick={()=>exportCSV(true)}>Export CSV</button>
          </div>
        </div>
      </main>
    </>
  );
}

/* ===== STYLE ===== */
const sectionCard = { background:"#fff", padding:32, borderRadius:20, boxShadow:"0 12px 28px rgba(0,0,0,0.1)", marginBottom:30 };
const input = { width:"100%", padding:"14px 16px", borderRadius:10, border:"1.5px solid #43034bff", fontSize:15, outline:"none", marginBottom:12 };
const table = { width:"100%", borderCollapse:"collapse" };
const btnPrimary = { background:"#ab3189ff", color:"#fff", border:"none", padding:"12px 22px", borderRadius:10, fontWeight:600, cursor:"pointer" };
const btnInfo = { background:"#1e40af", color:"#fff", border:"none", padding:"8px 14px", borderRadius:8, marginRight:6, fontWeight:600, cursor:"pointer" };
const btnDanger = { background:"#ef4444", color:"#fff", border:"none", padding:"8px 14px", borderRadius:8, fontWeight:600, cursor:"pointer" };
const btnSearch = { background:"#ab3189ff", color:"#fff", border:"none", padding:"0 26px", borderRadius:10, fontWeight:600, height:48, cursor:"pointer" };
